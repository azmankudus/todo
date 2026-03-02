package com.example.todo.todo.domain.repository;

import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;
import java.util.Optional;
import jakarta.transaction.Transactional;

import com.example.todo.todo.domain.model.Todo;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface TodoRepository extends CrudRepository<Todo, Integer> {

  Iterable<Todo> findAllOrderByCreatedAtDesc();

  @Override
  @Transactional
  Optional<Todo> findById(Integer id);

  @Transactional
  long count();
}
