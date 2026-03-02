package com.example.todo.modules.todo.web.dto;

import io.micronaut.core.annotation.Nullable;
import io.micronaut.serde.annotation.Serdeable;
import java.time.OffsetDateTime;

/**
 * Data Transfer Object for task response information.
 */
@Serdeable
public record TodoResponse(
                Integer id,
                String title,
                boolean completed,
                int priority,
                OffsetDateTime createdAt,
                @Nullable OffsetDateTime completedAt) {
}
