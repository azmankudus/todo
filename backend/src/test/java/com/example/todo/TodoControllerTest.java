package com.example.todo;

import io.micronaut.core.type.Argument;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import io.micronaut.http.client.exceptions.HttpClientResponseException;

@MicronautTest
class TodoControllerTest {

  @Inject
  @Client("${micronaut.server.context-path:}/api/todo")
  HttpClient client;

  @Test
  void testCreateTodo() {
    Todo todo = new Todo(null, "Create Task", false, null);
    Todo created = client.toBlocking().retrieve(HttpRequest.POST("/", todo), Todo.class);

    assertNotNull(created);
    assertNotNull(created.id());
    assertEquals("Create Task", created.title());
  }

  @Test
  void testListTodos() {
    Todo todo = new Todo(null, "List Task", false, null);
    client.toBlocking().retrieve(HttpRequest.POST("/", todo), Todo.class);

    List<Todo> list = client.toBlocking().retrieve(HttpRequest.GET("/"),
        Argument.listOf(Todo.class));
    assertTrue(list.size() >= 1);
  }

  @Test
  void testUpdateTodo() {
    Todo todo = new Todo(null, "Test Task", false, null);
    Todo created = client.toBlocking().retrieve(HttpRequest.POST("/", todo), Todo.class);

    Todo updateReq = new Todo(created.id(), "Updated Task", true, created.createdAt());
    Todo updated = client.toBlocking().retrieve(HttpRequest.PUT("/" + created.id(), updateReq), Todo.class);

    assertEquals("Updated Task", updated.title());
    assertTrue(updated.completed());
  }

  @Test
  void testValidation() {
    Todo invalidTodo = new Todo(null, "", false, null);
    assertThrows(HttpClientResponseException.class, () -> {
      client.toBlocking().exchange(HttpRequest.POST("/", invalidTodo));
    });
  }

  @Test
  void testDeleteTodo() {
    Todo todo = new Todo(null, "Delete Task", false, null);
    Todo created = client.toBlocking().retrieve(HttpRequest.POST("/", todo), Todo.class);

    client.toBlocking().exchange(HttpRequest.DELETE("/" + created.id()));
  }
}
