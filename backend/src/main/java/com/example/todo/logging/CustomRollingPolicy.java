package com.example.todo.logging;

import ch.qos.logback.core.rolling.RollingPolicyBase;
import ch.qos.logback.core.rolling.TriggeringPolicy;
import ch.qos.logback.core.rolling.RolloverFailure;
import ch.qos.logback.core.util.FileSize;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class CustomRollingPolicy<E> extends RollingPolicyBase implements TriggeringPolicy<E> {

    private FileSize maxFileSize;
    private FileSize totalSizeCap;
    private int uncompressedFileCount = 3;
    private boolean isFirst = true;

    @Override
    public void start() {
        super.start();
        if (maxFileSize == null) {
            addError("maxFileSize property is not set");
        }
    }

    @Override
    public boolean isTriggeringEvent(File activeFile, E event) {
        if (isFirst) {
            isFirst = false;
            if (activeFile.exists() && activeFile.length() > 0) {
                return true;
            }
        }
        return activeFile.exists() && activeFile.length() >= maxFileSize.getSize();
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

    public void setMaxFileSize(FileSize maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public void setTotalSizeCap(FileSize totalSizeCap) {
        this.totalSizeCap = totalSizeCap;
    }

    public void setUncompressedFileCount(int uncompressedFileCount) {
        this.uncompressedFileCount = uncompressedFileCount;
    }
}
