package com.example.todo.shared.util;

import io.micronaut.http.HttpStatus;

public final class HttpCodeUtil {

  private HttpCodeUtil() {
  }

  public static String toString(HttpStatus httpStatus) {
    return httpStatus.getCode() + " " + httpStatus.getReason();
  }
}
