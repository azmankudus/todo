package com.example.todo.todo;

import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import com.example.todo.todo.domain.repository.TodoRepository;

@MicronautTest
class RepoTest {

  @Inject
  TodoRepository repo;

  @Test
  void testDb() {
    try {
      System.out.println("Reading all stuff");
      repo.findAll().forEach(t -> System.out.println(t.title()));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
