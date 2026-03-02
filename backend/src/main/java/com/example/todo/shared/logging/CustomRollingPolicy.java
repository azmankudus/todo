package com.example.todo.shared.logging;

import ch.qos.logback.core.rolling.RollingPolicyBase;
import ch.qos.logback.core.rolling.TriggeringPolicy;
import ch.qos.logback.core.rolling.RolloverFailure;
import ch.qos.logback.core.util.FileSize;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Custom rolling policy that supports:
 * <ul>
 * <li><b>Size-based rolling</b> — rolls when active file exceeds
 * {@code maxFileSize}</li>
 * <li><b>Startup rolling</b> — rolls the existing log file on application
 * start</li>
 * <li><b>Time-scheduled rolling</b> — rolls at specific times of day (e.g.
 * "08:00,20:00")</li>
 * <li><b>Duration-based rolling</b> — rolls every N duration after app start
 * (e.g. "PT12H", "PT6H")</li>
 * </ul>
 *
 * <p>
 * Configuration in logback.xml:
 * </p>
 * 
 * <pre>{@code
 * <rollingPolicy class="com.example.todo.logging.CustomRollingPolicy">
 *   <maxFileSize>5MB</maxFileSize>
 *   <totalSizeCap>30MB</totalSizeCap>
 *   <uncompressedFileCount>3</uncompressedFileCount>
 *
 *   <!-- Option A: Roll at specific times (comma-separated HH:mm) -->
 *   <rollSchedule>08:00,20:00</rollSchedule>
 *
 *   <!-- Option B: Roll every duration after app start (ISO-8601 duration) -->
 *   <rollInterval>PT12H</rollInterval>
 * </pre>

 *
 * 
<p>
If both {@code rollSchedule} and {@code rollInterval} are set,
 * either condition being met will trigger a time-based roll.
</p>
 */
public class CustomRollingPolicy<E> extends RollingPolicyBase implements TriggeringPolicy<E> {

    private FileSize maxFileSize;
    private FileSize totalSizeCap;
    private int uncompressedFileCount = 3;
    private boolean isFirst = true;

    // Time-based rolling fields
    private String rollSchedule; // e.g. "08:00,20:00"
    private String rollInterval; // e.g. "PT12H" (ISO-8601 duration)

    private List<LocalTime> scheduledTimes;
    private Duration intervalDuration;
    private long appStartMillis;
    private long lastTimeRollMillis;

    @Override
    public void start() {
        super.start();
        if (maxFileSize == null) {
            addError("maxFileSize property is not set");
        }

        appStartMillis = System.currentTimeMillis();
        lastTimeRollMillis = appStartMillis;

        // Parse scheduled times (e.g. "08:00,20:00")
        if (rollSchedule != null && !rollSchedule.isBlank()) {
            scheduledTimes = new ArrayList<>();
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");
            for (String part : rollSchedule.split(",")) {
                try {
                    scheduledTimes.add(LocalTime.parse(part.trim(), fmt));
                } catch (Exception e) {
                    addError("Invalid rollSchedule time: '" + part.trim() + "'. Expected HH:mm format.", e);
                }
            }
            if (!scheduledTimes.isEmpty()) {
                Collections.sort(scheduledTimes);
                addInfo("Time-scheduled rolling enabled at: " + scheduledTimes);
            }
        }

        // Parse interval duration (e.g. "PT12H")
        if (rollInterval != null && !rollInterval.isBlank()) {
            try {
                intervalDuration = Duration.parse(rollInterval.trim());
                addInfo("Duration-based rolling enabled every: " + intervalDuration);
            } catch (Exception e) {
                addError("Invalid rollInterval: '" + rollInterval + "'. Expected ISO-8601 duration (e.g. PT12H).", e);
            }
        }
    }

    @Override
    public boolean isTriggeringEvent(File activeFile, E event) {
        // Roll on first event if file already has content (startup roll)
        if (isFirst) {
            isFirst = false;
            if (activeFile.exists() && activeFile.length() > 0) {
                lastTimeRollMillis = System.currentTimeMillis();
                return true;
            }
        }

        // Size-based trigger
        if (activeFile.exists() && activeFile.length() >= maxFileSize.getSize()) {
            lastTimeRollMillis = System.currentTimeMillis();
            return true;
        }

        // Time-based trigger: check both schedule and interval
        if (shouldRollByTime()) {
            lastTimeRollMillis = System.currentTimeMillis();
            return true;
        }

        return false;
    }

    /**
     * Check if a time-based roll should occur.
     * Returns true if either the scheduled time has passed since the last roll,
     * or the interval duration has elapsed since the last roll.
     */
    private boolean shouldRollByTime() {
        long now = System.currentTimeMillis();

        // Check scheduled times (e.g. roll at 08:00 and 20:00 daily)
        if (scheduledTimes != null && !scheduledTimes.isEmpty()) {
            LocalDateTime lastRollDt = new Date(lastTimeRollMillis).toInstant()
                    .atZone(TimeZone.getDefault().toZoneId()).toLocalDateTime();
            LocalDateTime nowDt = LocalDateTime.now();

            for (LocalTime scheduledTime : scheduledTimes) {
                // Find the most recent occurrence of this scheduled time
                LocalDateTime scheduledDt = nowDt.toLocalDate().atTime(scheduledTime);
                // If scheduled time is in the future today, check yesterday's occurrence
                if (scheduledDt.isAfter(nowDt)) {
                    continue;
                }
                // If this scheduled time is after our last roll, trigger a roll
                if (scheduledDt.isAfter(lastRollDt)) {
                    addInfo("Time-scheduled roll triggered at: " + scheduledTime);
                    return true;
                }
            }
        }

        // Check interval duration (e.g. every 12 hours since last roll)
        if (intervalDuration != null) {
            long elapsedSinceLastRoll = now - lastTimeRollMillis;
            if (elapsedSinceLastRoll >= intervalDuration.toMillis()) {
                addInfo("Duration-based roll triggered after: " + intervalDuration);
                return true;
            }
        }

        return false;
    }

    @Override
    public void rollover() throws RolloverFailure {
        String activeFileName = getActiveFileName();
        if (activeFileName == null) {
            activeFileName = getParentsRawFileProperty();
        }

        File activeFile = new File(activeFileName);
        if (!activeFile.exists() || activeFile.length() == 0) {
            return;
        }

        try {
            long lastModified = activeFile.lastModified();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
            String timestamp = sdf.format(new Date(lastModified));

            String basePath = activeFileName;
            if (basePath.endsWith(".log")) {
                basePath = basePath.substring(0, basePath.length() - 4);
            }

            String newFileName = basePath + "-" + timestamp + ".log";
            File newFile = new File(newFileName);

            int counter = 1;
            while (newFile.exists()) {
                newFileName = basePath + "-" + timestamp + "-" + String.format("%04d", counter) + ".log";
                newFile = new File(newFileName);
                counter++;
            }

            activeFile.renameTo(newFile);

            manageArchivedFiles(activeFileName);

        } catch (Exception e) {
            addError("Failed to rollover", e);
            throw new RolloverFailure("Failed to rollover");
        }
    }

    private void manageArchivedFiles(String activeFileName) {
        File activeFile = new File(activeFileName);
        File parentDir = activeFile.getParentFile();
        if (parentDir == null || !parentDir.exists())
            return;

        String baseName = activeFile.getName();
        if (baseName.endsWith(".log")) {
            baseName = baseName.substring(0, baseName.length() - 4);
        }

        final String finalBaseName = baseName;
        final String finalActiveName = activeFile.getName();

        File[] files = parentDir
                .listFiles((dir, name) -> name.startsWith(finalBaseName) && !name.equals(finalActiveName));
        if (files == null)
            return;

        List<File> logFiles = new ArrayList<>();
        List<File> zipFiles = new ArrayList<>();

        for (File f : files) {
            if (f.getName().endsWith(".log")) {
                logFiles.add(f);
            } else if (f.getName().endsWith(".zip")) {
                zipFiles.add(f);
            }
        }

        logFiles.sort((f1, f2) -> Long.compare(f2.lastModified(), f1.lastModified()));

        for (int i = uncompressedFileCount; i < logFiles.size(); i++) {
            File toZip = logFiles.get(i);
            if (zipFile(toZip)) {
                toZip.delete();
                zipFiles.add(new File(toZip.getAbsolutePath() + ".zip"));
            }
        }

        if (totalSizeCap != null) {
            List<File> allFiles = new ArrayList<>();
            for (int i = 0; i < Math.min(logFiles.size(), uncompressedFileCount); i++) {
                allFiles.add(logFiles.get(i));
            }
            allFiles.addAll(zipFiles);
            allFiles.sort((f1, f2) -> Long.compare(f2.lastModified(), f1.lastModified()));

            long currentSize = 0;
            for (File f : allFiles) {
                if (f.exists()) {
                    currentSize += f.length();
                    if (currentSize > totalSizeCap.getSize()) {
                        f.delete();
                    }
                }
            }
        }
    }

    private boolean zipFile(File file) {
        try (FileOutputStream fos = new FileOutputStream(file.getAbsolutePath() + ".zip");
                ZipOutputStream zos = new ZipOutputStream(fos);
                FileInputStream fis = new FileInputStream(file)) {

            ZipEntry zipEntry = new ZipEntry(file.getName());
            zos.putNextEntry(zipEntry);

            byte[] bytes = new byte[1024];
            int length;
            while ((length = fis.read(bytes)) >= 0) {
                zos.write(bytes, 0, length);
            }
            zos.closeEntry();
            return true;
        } catch (Exception e) {
            addError("Failed to zip file " + file.getName(), e);
            return false;
        }
    }

    @Override
    public String getActiveFileName() {
        return getParentsRawFileProperty();
    }

    // Setters for logback XML configuration

    public void setMaxFileSize(FileSize maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public void setTotalSizeCap(FileSize totalSizeCap) {
        this.totalSizeCap = totalSizeCap;
    }

    public void setUncompressedFileCount(int uncompressedFileCount) {
        this.uncompressedFileCount = uncompressedFileCount;
    }

    public void setRollSchedule(String rollSchedule) {
        this.rollSchedule = rollSchedule;
    }

    public void setRollInterval(String rollInterval) {
        this.rollInterval = rollInterval;
    }
}
