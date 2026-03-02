package com.example.todo.modules.auth.web.dto;

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
