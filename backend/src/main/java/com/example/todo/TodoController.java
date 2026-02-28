package com.example.todo;

import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Controller(value = "/api/todo", produces = MediaType.APPLICATION_JSON, consumes = MediaType.APPLICATION_JSON)
public class TodoController {

  private static final Logger log = LoggerFactory.getLogger(TodoController.class);
  private final TodoRepository repository;

  public TodoController(TodoRepository repository) {
    this.repository = repository;
  }

  @Get
  public List<Todo> listTodos() {
    if (log.isDebugEnabled()) {
      log.debug("GET /todos - Fetching all todos");
    }
    List<Todo> result = StreamSupport.stream(repository.findAll().spliterator(), false)
        .collect(Collectors.toList());
    if (log.isTraceEnabled()) {
      log.trace("Fetched {} todos", result.size());
    }
    return result;
  }

  @Post
  public Todo createTodo(@Valid @Body Todo todo) {
    if (log.isDebugEnabled()) {
      log.debug("POST /api/todos - Creating new todo: {}", todo.title());
    }
    Todo result = repository.save(todo);
    if (log.isTraceEnabled()) {
      log.trace("Created todo with id: {}", result.id());
    }
    return result;
  }

  @Put("/{id}")
  public Todo updateTodo(String id, @Valid @Body Todo todo) {
    if (log.isDebugEnabled()) {
      log.debug("PUT /api/todos/{} - Updating todo", id);
    }
    var existing = repository.findById(id).orElse(null);
    if (existing != null) {
      OffsetDateTime completedAt = null;
      if (todo.completed()) {
        completedAt = existing.completedAt() != null ? existing.completedAt() : OffsetDateTime.now();
      }

      Todo updated = new Todo(existing.id(), todo.title(), todo.completed(), todo.priority(), existing.createdAt(),
          completedAt);
      if (log.isTraceEnabled()) {
        log.trace("Updated todo with id: {}. completed: {}, completedAt: {}", updated.id(), updated.completed(),
            updated.completedAt());
      }
      return repository.update(updated);
    }
    if (log.isTraceEnabled()) {
      log.trace("Todo with id: {} not found for update", id);
    }
    return null;
  }

  @Delete("/{id}")
  public void deleteTodo(String id) {
    if (log.isDebugEnabled()) {
      log.debug("DELETE /api/todos/{} - Deleting todo", id);
    }
    repository.deleteById(id);
    if (log.isTraceEnabled()) {
      log.trace("Deleted todo with id: {}", id);
    }
  }
}
