package com.example.todo.modules.auth.domain.repository;

import com.example.todo.modules.auth.domain.model.RefreshToken;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import java.util.Optional;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, Integer> {
  Optional<RefreshToken> findByToken(String token);

  long deleteByUserId(Integer userId);
}
