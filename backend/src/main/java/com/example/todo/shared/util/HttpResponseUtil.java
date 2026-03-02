package com.example.todo.shared.util;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MutableHttpResponse;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

import com.example.todo.shared.api.RequestStatus;

public final class HttpResponseUtil {

  private HttpResponseUtil() {
  }

  public static MutableHttpResponse<Map<String, Object>> create(HttpStatus status, String traceId,
      RequestStatus requestStatus,
      String code,
      String message, OffsetDateTime startTime, Object details) {
    OffsetDateTime now = OffsetDateTime.now();
    Duration duration = Duration.between(startTime, now);

    long days = duration.toDays();
    long hours = duration.toHoursPart();
    long minutes = duration.toMinutesPart();
    long seconds = duration.toSecondsPart();
    long millis = duration.toMillisPart();
    String durationStr = String.format("%02d:%02d:%02d:%02d.%03d", days, hours, minutes, seconds, millis);

    Map<String, Object> body = new LinkedHashMap<>();
    body.put("timestamp", now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
    body.put("http_status", status.getCode() + " " + status.getReason());
    body.put("trace_id", traceId);
    body.put("status", requestStatus.name());
    body.put("start", startTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
    body.put("duration", durationStr);
    body.put("code", code);
    body.put("message", message);
    body.put("details", details != null ? details : Map.of());

    if (status == HttpStatus.OK) {
      return HttpResponse.ok(body);
    }

    return HttpResponse.status(status).body(body);
  }
}
