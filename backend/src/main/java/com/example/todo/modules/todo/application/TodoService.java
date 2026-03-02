package com.example.todo.modules.todo.application;

import com.example.todo.modules.todo.domain.model.Todo;
import com.example.todo.modules.todo.domain.repository.TodoRepository;

import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import jakarta.inject.Singleton;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Singleton
public class TodoService {

  private static final Logger logger = LoggerFactory.getLogger(TodoService.class.getName());

  private final TodoRepository repository;

  public TodoService(TodoRepository repository) {
    this.repository = repository;
  }

  public List<Todo> findAll() {
    return StreamSupport.stream(repository.findAll().spliterator(), false)
        .toList();
  }

  public Page<Todo> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  public Optional<Todo> findById(Integer id) {
    return repository.findById(id);
  }

  public Todo create(Todo todo) {
    Todo created = repository.save(todo);
    if (logger.isDebugEnabled()) {
      logger.debug("Todo created: {} (ID: {})", created.title(), created.id());
    }
    return created;
  }

  public Todo update(Integer id, Todo todo) {
    Optional<Todo> existingResult = repository.findById(id);
    if (existingResult.isPresent()) {
      Todo existing = existingResult.get();
      OffsetDateTime completedAt = null;
      if (todo.completed()) {
        completedAt = existing.completedAt() != null ? existing.completedAt() : OffsetDateTime.now();
      }

      Todo updated = new Todo(
          existing.id(),
          todo.title(),
          todo.completed(),
          todo.priority(),
          existing.createdAt(),
          completedAt);
      repository.update(updated);
      if (logger.isDebugEnabled()) {
        logger.debug("Todo updated: {} (ID: {})", updated.title(), updated.id());
      }
      return updated;
    }
    logger.warn("Update failed: Todo with ID {} not found", id);
    return null;
  }

  public void delete(Integer id) {
    if (logger.isDebugEnabled()) {
      logger.debug("Deleting todo ID: {}", id);
    }
    repository.deleteById(id);
  }
}
