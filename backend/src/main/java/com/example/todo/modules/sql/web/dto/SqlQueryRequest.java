package com.example.todo.modules.sql.web.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record SqlQueryRequest(String query, Integer page, Integer size) {
}
