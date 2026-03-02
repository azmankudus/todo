package com.example.todo.auth.domain.repository;

import com.example.todo.auth.domain.model.Role;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import java.util.Optional;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface RoleRepository extends CrudRepository<Role, Integer> {
  Optional<Role> findByName(String name);
}
