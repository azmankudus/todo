package com.example.todo.auth.api.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record RefreshRequest(String refreshToken) {
}
