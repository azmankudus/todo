package com.example.todo.shared.util;

import com.fasterxml.uuid.Generators;
import java.util.UUID;

public final class UuidUtil {

  private UuidUtil() {
  }

  public static UUID timeBasedUuid() {
    return Generators.timeBasedGenerator().generate();
  }

  public static String timeBasedUuidString() {
    return timeBasedUuid().toString();
  }
}
