package com.example.todo.shared.error;

import java.time.OffsetDateTime;

import com.example.todo.shared.util.UuidUtil;

public class ApplicationException extends RuntimeException {
  private final String traceId;
  private final OffsetDateTime startTime;
  private final String errorCode;
  private final String errorDescription;

  public ApplicationException() {
    this(UuidUtil.timeBasedUuidString(), OffsetDateTime.now(), "00000000", "Application error");
  }

  public ApplicationException(String errorCode, String errorDescription) {
    this(UuidUtil.timeBasedUuidString(), OffsetDateTime.now(), errorCode, errorDescription);
  }

  public ApplicationException(String errorCode, String errorDescription, Throwable cause) {
    this(UuidUtil.timeBasedUuidString(), OffsetDateTime.now(), errorCode, errorDescription, cause);
  }

  public ApplicationException(String traceId, OffsetDateTime startTime, String errorCode, String errorDescription) {
    super(errorDescription);
    this.traceId = traceId;
    this.startTime = startTime;
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }

  public ApplicationException(String traceId, OffsetDateTime startTime, String errorCode, String errorDescription,
      Throwable cause) {
    super(errorDescription, cause);
    this.traceId = traceId;
    this.startTime = startTime;
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }

  public String getTraceId() {
    return traceId;
  }

  public OffsetDateTime getStartTime() {
    return startTime;
  }

  public String getErrorCode() {
    return errorCode;
  }

  public String getErrorDescription() {
    return errorDescription;
  }
}
