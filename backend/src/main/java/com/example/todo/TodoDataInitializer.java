package com.example.todo;

import io.micronaut.context.event.ApplicationEventListener;
import io.micronaut.runtime.server.event.ServerStartupEvent;
import jakarta.inject.Singleton;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Random;
import java.util.UUID;

@Singleton
public class TodoDataInitializer implements ApplicationEventListener<ServerStartupEvent> {

  private static final Logger log = LoggerFactory.getLogger(TodoDataInitializer.class);
  private final TodoRepository repository;

  private static final String[] TASK_PREFIXES = {
      "Review", "Update", "Fix", "Implement", "Design", "Test", "Deploy", "Refactor",
      "Document", "Research", "Plan", "Optimize", "Configure", "Migrate", "Monitor",
      "Debug", "Analyze", "Prototype", "Integrate", "Audit"
  };

  private static final String[] TASK_SUBJECTS = {
      "login page", "database schema", "API endpoints", "user dashboard", "payment module",
      "email notifications", "search functionality", "file upload", "caching layer", "CI/CD pipeline",
      "unit tests", "security headers", "error handling", "logging system", "admin panel",
      "user authentication", "data export feature", "mobile layout", "performance metrics", "backup strategy",
      "rate limiter", "webhook handler", "session management", "dark mode toggle", "accessibility audit"
  };

  public TodoDataInitializer(TodoRepository repository) {
    this.repository = repository;
  }

  @Override
  public void onApplicationEvent(ServerStartupEvent event) {
    long existing = repository.count();
    if (existing > 0) {
      log.info("Database already has {} todos, skipping data initialization.", existing);
      return;
    }

    log.info("No todos found. Seeding 50 random tasks...");
    Random random = new Random(42);

    for (int i = 0; i < 50; i++) {
      String prefix = TASK_PREFIXES[random.nextInt(TASK_PREFIXES.length)];
      String subject = TASK_SUBJECTS[random.nextInt(TASK_SUBJECTS.length)];
      String title = prefix + " " + subject;

      int daysAgo = random.nextInt(30);
      int hoursAgo = random.nextInt(24);
      int minutesAgo = random.nextInt(60);
      OffsetDateTime createdAt = OffsetDateTime.now(ZoneOffset.UTC)
          .minusDays(daysAgo)
          .minusHours(hoursAgo)
          .minusMinutes(minutesAgo);

      boolean completed = random.nextInt(100) < 40;
      OffsetDateTime completedAt = null;
      if (completed) {
        int hoursAfter = 1 + random.nextInt(48);
        completedAt = createdAt.plusHours(hoursAfter);
        if (completedAt.isAfter(OffsetDateTime.now(ZoneOffset.UTC))) {
          completedAt = OffsetDateTime.now(ZoneOffset.UTC);
        }
      }

      int priority = random.nextInt(3);

      Todo todo = new Todo(UUID.randomUUID().toString(), title, completed, priority, createdAt, completedAt);
      repository.save(todo);
    }

    log.info("Seeded 50 random tasks successfully.");
  }
}
