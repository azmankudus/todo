package com.example.todo.modules.auth.domain.model;

import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;

@MappedEntity("tb_permission")
public record Permission(
    @Id @GeneratedValue(GeneratedValue.Type.IDENTITY) Integer id,
    String name,
    String description) {
}
