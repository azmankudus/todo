package com.example.todo.auth.api.dto;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Serdeable
public record RegisterRequest(
    @NotBlank @Email String email,
    @NotBlank @Size(min = 3, max = 50) String username,
    @NotBlank String fullname,
    @NotBlank @Size(min = 6) String password) {
}
