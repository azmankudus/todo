package com.example.todo.error.api;

import com.example.todo.shared.api.RequestStatus;
import com.example.todo.shared.error.ApplicationException;

import io.micronaut.http.MutableHttpResponse;

import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.OffsetDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.todo.shared.util.HttpResponseUtil;
import com.example.todo.shared.util.UuidUtil;

@Controller(value = "/api/error", produces = MediaType.APPLICATION_JSON, consumes = MediaType.APPLICATION_JSON)

@Secured(SecurityRule.IS_ANONYMOUS)
public class ErrorController {

  private static final Logger logger = LoggerFactory.getLogger(ErrorController.class.getName());

  @Get("/{code}")
  public MutableHttpResponse<?> error(@PathVariable int code) {
    OffsetDateTime startTime = OffsetDateTime.now();
    String requestId = "ERR-" + UuidUtil.timeBasedUuidString();
    if (logger.isDebugEnabled()) {
      logger.debug("Error simulation requested for code: {} (Request ID: {})", code, requestId);
    }
    if (logger.isTraceEnabled()) {
      logger.trace("Error simulation details: code={}", code);
    }
    String details = "";

    RequestStatus requestStatus = (code >= 200 && code < 300)
        ? RequestStatus.SUCCESS
        : RequestStatus.ERROR;

    String appErrorCode = "ERR-00000000";
    String message = "Success dummy response";

    if (code >= 400 && code < 500) {
      appErrorCode = "ERR-00000400";
      message = "Client error simulation";
    } else if (code >= 500 && code < 600) {
      appErrorCode = "ERR-" + String.format("%08d", (int) (Math.random() * 10000));
      message = "A simulated server error occurred.";

      ApplicationException exception = new ApplicationException(requestId, startTime, appErrorCode, message);
      try (StringWriter stringWriter = new StringWriter();
          PrintWriter printWriter = new PrintWriter(stringWriter)) {
        exception.printStackTrace(printWriter);
        details = stringWriter.toString();
      } catch (IOException e) {
        details = "";
      }
    } else if (code < 200 || code >= 300) {
      appErrorCode = "ERR-00000999";
      message = "Unknown status code";
    }

    return HttpResponseUtil.create(
        HttpStatus.valueOf(code),
        requestId,
        requestStatus,
        appErrorCode,
        message,
        startTime,
        details);
  }
}
