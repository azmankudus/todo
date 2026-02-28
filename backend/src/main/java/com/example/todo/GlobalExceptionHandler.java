package com.example.todo;

import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;

@Produces
@Singleton
@Requires(classes = { Exception.class, ExceptionHandler.class })
public class GlobalExceptionHandler implements ExceptionHandler<Exception, HttpResponse<ErrorResponse>> {

    private static final String ERROR_STATUS = "error";
    private static final String ERROR_CODE = "0001";

    @Override
    public HttpResponse<ErrorResponse> handle(HttpRequest request, Exception exception) {
        ErrorResponse errorResponse = new ErrorResponse(
                ERROR_STATUS,
                ERROR_CODE,
                exception.getMessage() != null ? exception.getMessage() : "An error occurred");

        return HttpResponse.badRequest(errorResponse);
    }
}