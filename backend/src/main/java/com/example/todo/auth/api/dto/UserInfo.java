package com.example.todo.auth.api.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record UserInfo(
    Integer id,
    String email,
    String username,
    String fullname,
    java.util.List<String> roles) {
}
