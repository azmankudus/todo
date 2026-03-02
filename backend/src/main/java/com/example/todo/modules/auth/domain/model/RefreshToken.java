package com.example.todo.modules.auth.domain.model;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;

import java.time.OffsetDateTime;

@MappedEntity("tb_refresh_token")
public record RefreshToken(
    @Id @GeneratedValue(GeneratedValue.Type.IDENTITY) Integer id,
    Integer userId,
    String token,
    OffsetDateTime expiresAt,
    @DateCreated OffsetDateTime createdAt) {
}
