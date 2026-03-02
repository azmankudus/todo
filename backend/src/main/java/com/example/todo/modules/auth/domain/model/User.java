package com.example.todo.modules.auth.domain.model;

import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.Relation;

import java.util.Set;

@MappedEntity("tb_user")
public record User(
    @Id @GeneratedValue(GeneratedValue.Type.IDENTITY) Integer id,
    String email,
    String username,
    String fullname,
    String password,

    @Relation(value = Relation.Kind.ONE_TO_MANY, mappedBy = "user") Set<UserRole> roles) {
}
