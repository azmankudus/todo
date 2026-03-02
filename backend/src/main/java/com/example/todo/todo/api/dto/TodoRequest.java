package com.example.todo.todo.api.dto;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for creating or updating a task.
 */
@Serdeable
public record TodoRequest(
        @NotBlank String title,
        boolean completed,
        int priority) {
}
