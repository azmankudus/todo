package com.example.todo.modules.todo.domain.repository;

import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.repository.PageableRepository;
import java.util.Optional;
import jakarta.transaction.Transactional;

import com.example.todo.modules.todo.domain.model.Todo;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface TodoRepository extends PageableRepository<Todo, Integer> {

  @Override
  Page<Todo> findAll(Pageable pageable);

  Optional<Todo> findById(Integer id);

  @Transactional
  long count();
}
