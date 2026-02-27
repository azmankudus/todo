package com.example.todo;

import io.micronaut.data.annotation.Query;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import java.util.Optional;
import java.util.List;
import jakarta.transaction.Transactional;

@JdbcRepository(dialect = Dialect.ANSI)
public interface TodoRepository extends CrudRepository<Todo, String> {

  @Transactional
  List<Todo> findAll();

  @Transactional
  Optional<Todo> findById(String id);

  @Transactional
  boolean existsById(String id);

  @SuppressWarnings("unchecked")
  @Query("INSERT INTO todo (id, title, completed, created_at) VALUES (:id, :title, :completed, :createdAt) RETURNING *")
  Todo save(Todo entity);
}
