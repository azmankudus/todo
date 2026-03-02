package com.example.todo.auth.domain.repository;

import com.example.todo.auth.domain.model.User;
import io.micronaut.data.annotation.Join;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import java.util.Optional;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface UserRepository extends CrudRepository<User, Integer> {

  @Join(value = "roles", type = Join.Type.LEFT_FETCH)
  @Join(value = "roles.role", type = Join.Type.LEFT_FETCH)
  @Join(value = "roles.role.permissions", type = Join.Type.LEFT_FETCH)
  @Join(value = "roles.role.permissions.permission", type = Join.Type.LEFT_FETCH)
  Optional<User> findById(Integer id);

  @Join(value = "roles", type = Join.Type.LEFT_FETCH)
  @Join(value = "roles.role", type = Join.Type.LEFT_FETCH)
  @Join(value = "roles.role.permissions", type = Join.Type.LEFT_FETCH)
  @Join(value = "roles.role.permissions.permission", type = Join.Type.LEFT_FETCH)
  Optional<User> findByEmail(String email);

  @Join(value = "roles", type = Join.Type.LEFT_FETCH)
  @Join(value = "roles.role", type = Join.Type.LEFT_FETCH)
  @Join(value = "roles.role.permissions", type = Join.Type.LEFT_FETCH)
  @Join(value = "roles.role.permissions.permission", type = Join.Type.LEFT_FETCH)
  Optional<User> findByUsernameOrEmail(String username, String email);

  boolean existsByEmail(String email);

  boolean existsByUsername(String username);
}
