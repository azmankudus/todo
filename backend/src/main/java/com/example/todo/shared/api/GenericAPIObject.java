package com.example.todo.shared.api;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;
import java.util.Map;

@Serdeable
@Introspected
public record GenericAPIObject(
    ClientInfo client,
    ServerInfo server) {
  @Serdeable
  public record ClientInfo(
      ClientHttpInfo http,
      ClientRequestInfo request,
      ClientResponseInfo response) {
  }

  @Serdeable
  public record ClientHttpInfo(
      Map<String, String> headers) {
  }

  @Serdeable
  public record ClientRequestInfo(
      String trace_id,
      String timestamp) {
  }

  @Serdeable
  public record ClientResponseInfo(
      String timestamp,
      String duration) {
  }

  @Serdeable
  public record ServerInfo(
      ServerHttpInfo http,
      ServerRequestInfo request,
      ServerResponseInfo response) {
  }

  @Serdeable
  public record ServerHttpInfo(
      String status,
      Map<String, String> headers) {
  }

  @Serdeable
  public record ServerRequestInfo(
      String trace_id,
      String timestamp) {
  }

  @Serdeable
  public record ServerResponseInfo(
      String timestamp,
      String duration,
      String status,
      String code,
      String message,
      Object details) {
  }
}
