package com.example.todo.todo.domain.model;

import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.serde.annotation.Serdeable;

import jakarta.validation.constraints.NotBlank;
import io.micronaut.core.annotation.Nullable;
import java.time.OffsetDateTime;

@Serdeable
@MappedEntity("tb_todo")
public record Todo(
    @Id @GeneratedValue(GeneratedValue.Type.IDENTITY) Integer id,
    @NotBlank String title,
    boolean completed,
    int priority,
    OffsetDateTime createdAt,
    @Nullable OffsetDateTime completedAt) {
  public Todo {
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
  }
}
