package com.example.todo.auth.api.dto;

import io.micronaut.serde.annotation.Serdeable;
import java.util.List;

@Serdeable
public record UserInfo(
        Integer id,
        String email,
        String username,
        String fullname,
        List<String> roles) {
}
