package com.example.todo.shared.error;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.todo.shared.api.RequestStatus;
import com.example.todo.shared.util.HttpResponseUtil;

@Singleton
public class ApplicationExceptionHandler
    implements ExceptionHandler<ApplicationException, HttpResponse<Map<String, Object>>> {

  private static final Logger logger = LoggerFactory.getLogger(ApplicationExceptionHandler.class.getName());

  @Override
  @SuppressWarnings("rawtypes")
  public HttpResponse<Map<String, Object>> handle(HttpRequest request, ApplicationException exception) {

    logger.error("Application error [{}]: {} (Trace ID: {})", exception.getErrorCode(), exception.getErrorDescription(),
        exception.getTraceId(), exception);

    String exceptionStackTrace;
    try (StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter)) {
      exception.printStackTrace(printWriter);
      exceptionStackTrace = stringWriter.toString();
    } catch (IOException e) {
      exceptionStackTrace = "";
    }

    return HttpResponseUtil.create(
        HttpStatus.INTERNAL_SERVER_ERROR,
        exception.getTraceId(),
        RequestStatus.ERROR,
        exception.getErrorCode(),
        exception.getErrorDescription(),
        exception.getStartTime(),
        Map.of("stackTrace", exceptionStackTrace));
  }
}
