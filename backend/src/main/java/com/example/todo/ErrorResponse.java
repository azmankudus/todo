package com.example.todo;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ErrorResponse(
    @JsonProperty("status") String status,
    @JsonProperty("code") String code,
    @JsonProperty("description") String description) {
}