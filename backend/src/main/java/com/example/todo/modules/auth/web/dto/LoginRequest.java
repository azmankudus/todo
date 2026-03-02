package com.example.todo.modules.auth.web.dto;

import io.micronaut.serde.annotation.Serdeable;
import com.fasterxml.jackson.annotation.JsonProperty;

@Serdeable
public record LoginRequest(
    String email,
    String password,
    @JsonProperty("rememberMe") Boolean rememberMe) {

  public boolean isRememberMe() {
    return rememberMe != null && rememberMe;
  }
}
