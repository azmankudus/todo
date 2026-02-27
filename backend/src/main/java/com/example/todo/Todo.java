package com.example.todo;

import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.serde.annotation.Serdeable;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.UUID;

@Serdeable
@MappedEntity
public record Todo(
    @Id String id,
    @NotBlank String title,
    boolean completed,
    LocalDateTime createdAt) {
  public Todo {
    if (id == null) {
      id = UUID.randomUUID().toString();
    }
    if (createdAt == null) {
      createdAt = LocalDateTime.now();
    }
  }
}
