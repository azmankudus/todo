package com.example.todo.modules.auth.web.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record RefreshRequest(String refreshToken) {
}
