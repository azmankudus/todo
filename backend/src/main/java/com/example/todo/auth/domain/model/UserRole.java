package com.example.todo.auth.domain.model;

import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.Relation;

@MappedEntity("tb_user_role")
public record UserRole(
    @Id @GeneratedValue(GeneratedValue.Type.IDENTITY) Integer id,

    @Relation(Relation.Kind.MANY_TO_ONE) User user,

    @Relation(Relation.Kind.MANY_TO_ONE) Role role) {
}
