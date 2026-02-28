package com.example.todo;

import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@MicronautTest
public class RepoTest {

  private static final Logger log = LoggerFactory.getLogger(RepoTest.class);

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
