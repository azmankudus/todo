package com.example.todo;

import io.micronaut.core.annotation.NonNull;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.server.exceptions.response.ErrorContext;
import io.micronaut.http.server.exceptions.response.ErrorResponseProcessor;
import jakarta.inject.Singleton;

@Singleton
public class DefaultErrorProcessor implements ErrorResponseProcessor<Object> {

    @SuppressWarnings("unchecked")
    @Override
    public @NonNull MutableHttpResponse<Object> processResponse(@NonNull ErrorContext errorContext,
            @NonNull MutableHttpResponse<?> baseResponse) {
        return (@NonNull MutableHttpResponse<Object>) baseResponse;
    }
}