package com.example.todo.sql.api.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record SqlQueryRequest(String query, Integer page, Integer size) {
}
