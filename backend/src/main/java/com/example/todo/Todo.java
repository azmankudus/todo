package com.example.todo;

import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.serde.annotation.Serdeable;

import jakarta.validation.constraints.NotBlank;
import io.micronaut.core.annotation.Nullable;
import java.time.OffsetDateTime;
import java.util.UUID;

@Serdeable
@MappedEntity
public record Todo(
    @Id String id,
    @NotBlank String title,
    boolean completed,
    int priority,
    OffsetDateTime createdAt,
    @Nullable OffsetDateTime completedAt) {
  public Todo {
    if (id == null) {
      id = UUID.randomUUID().toString();
    }
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
  }
}
