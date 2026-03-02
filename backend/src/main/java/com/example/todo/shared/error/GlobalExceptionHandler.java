package com.example.todo.shared.error;

import java.util.Map;

import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;

@Produces
@Singleton
@Requires(classes = { Exception.class, ExceptionHandler.class })
public class GlobalExceptionHandler implements ExceptionHandler<Exception, HttpResponse<Map<String, Object>>> {

    private final ApplicationExceptionHandler applicationExceptionHandler;

    public GlobalExceptionHandler(ApplicationExceptionHandler applicationExceptionHandler) {
        this.applicationExceptionHandler = applicationExceptionHandler;
    }

    @Override
    @SuppressWarnings("rawtypes")
    public HttpResponse<Map<String, Object>> handle(HttpRequest request, Exception exception) {
        if (exception instanceof ApplicationException) {
            return applicationExceptionHandler.handle(request, (ApplicationException) exception);
        }

        // Wrap generic exception into ApplicationException
        ApplicationException wrapped = new ApplicationException("00000000",
                exception.getMessage() != null ? exception.getMessage() : "Application error",
                exception);

        return applicationExceptionHandler.handle(request, wrapped);
    }
}