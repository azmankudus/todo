package com.example.todo.shared.api;

public enum RequestStatus {
  SUCCESS("success"), WARNING("warning"), ERROR("error");

  private final String value;

  RequestStatus(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
