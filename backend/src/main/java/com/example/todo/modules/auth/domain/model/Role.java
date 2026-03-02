package com.example.todo.modules.auth.domain.model;

import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.Relation;

import java.util.Set;

@MappedEntity("tb_role")
public record Role(
    @Id @GeneratedValue(GeneratedValue.Type.IDENTITY) Integer id,
    String name,
    String description,

    @Relation(value = Relation.Kind.ONE_TO_MANY, mappedBy = "role") Set<RolePermission> permissions) {
}
