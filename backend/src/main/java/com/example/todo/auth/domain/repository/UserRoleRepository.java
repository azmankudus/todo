package com.example.todo.auth.domain.repository;

import com.example.todo.auth.domain.model.UserRole;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface UserRoleRepository extends CrudRepository<UserRole, Integer> {
}
