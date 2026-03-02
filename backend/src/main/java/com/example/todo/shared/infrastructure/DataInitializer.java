package com.example.todo.shared.infrastructure;

import com.example.todo.auth.domain.model.Permission;
import com.example.todo.auth.domain.model.Role;
import com.example.todo.auth.domain.model.User;
import com.example.todo.auth.domain.repository.PermissionRepository;
import com.example.todo.auth.domain.repository.RoleRepository;
import com.example.todo.auth.domain.repository.UserRepository;
import com.example.todo.auth.domain.model.RolePermission;
import com.example.todo.auth.domain.model.UserRole;
import com.example.todo.todo.domain.model.Todo;
import com.example.todo.todo.domain.repository.TodoRepository;

import at.favre.lib.crypto.bcrypt.BCrypt;
import io.micronaut.context.annotation.Requires;
import io.micronaut.context.event.ApplicationEventListener;
import io.micronaut.context.event.StartupEvent;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Singleton
@Requires(property = "data-initialization.enabled", value = "true", defaultValue = "true")
public class DataInitializer implements ApplicationEventListener<StartupEvent> {

  private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class.getName());

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PermissionRepository permissionRepository;
  private final TodoRepository todoRepository;

  public DataInitializer(
      UserRepository userRepository,
      RoleRepository roleRepository,
      PermissionRepository permissionRepository,
      TodoRepository todoRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.permissionRepository = permissionRepository;
    this.todoRepository = todoRepository;
  }

  @Override
  @Transactional
  public void onApplicationEvent(StartupEvent event) {
    logger.info("Starting combined data initialization...");

    initializeRBAC();
    initializeUsers();
    initializeTodos();

    logger.info("Combined data initialization completed");
  }

  private void initializeRBAC() {
    logger.info("Initializing RBAC...");

    // Permissions
    Permission pTodoRead = getOrCreatePermission("todo:read", "Permission to read todos");
    Permission pTodoWrite = getOrCreatePermission("todo:write", "Permission to create/edit todos");
    Permission pUserRead = getOrCreatePermission("user:read", "Permission to view other users");
    Permission pUserWrite = getOrCreatePermission("user:write", "Permission to manage users");
    Permission pAdmin = getOrCreatePermission("admin:all", "Full administrative access");

    // Roles
    getOrCreateRole("ADMIN", "System Administrator",
        Set.of(pTodoRead, pTodoWrite, pUserRead, pUserWrite, pAdmin));
    getOrCreateRole("MANAGER", "Task Manager", Set.of(pTodoRead, pTodoWrite, pUserRead));
    getOrCreateRole("USER", "Regular User", Set.of(pTodoRead, pTodoWrite));
  }

  private void initializeUsers() {
    logger.info("Initializing default users...");

    Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
    Role managerRole = roleRepository.findByName("MANAGER").orElseThrow();
    Role userRole = roleRepository.findByName("USER").orElseThrow();

    createUserIfNotExists("admin0001@example.com", "admin0001", "Administrator 0001", Set.of(adminRole));
    createUserIfNotExists("manager0001@example.com", "manager0001", "Manager 0001", Set.of(managerRole));
    createUserIfNotExists("user0001@example.com", "user0001", "User 0001", Set.of(userRole));
  }

  private void initializeTodos() {
    if (todoRepository.count() > 0) {
      return;
    }

    logger.info("Seeding 500 fun random todos...");
    Random random = new Random(42);

    String[] verbs = {
        "Brew", "Debug", "Hyper-focus on", "Ignore", "Refactor", "Ponder", "Optimize",
        "Delete", "Summon", "Ship", "Wrangle", "Untangle", "Contemplate", "Launch",
        "Polish", "Rescue", "Challenge", "Automate", "Explain", "Demystify", "Sync",
        "Visualize", "Deploy", "Hack", "Benchmark", "Containerize", "Scale", "Verify"
    };

    String[] subjects = {
        "coffee", "legacy code", "vibe check", "quantum bugs", "CSS shadows", "React hooks",
        "space-time continuum", "backend wizardry", "dark mode", "keyboard shortcuts", "regex",
        "undefined", "null pointers", "rubber duck", "the cloud", "edge cases",
        "micro-interactions", "hotfixes", "deployment scripts", "technical debt", "Unit tests",
        "API endpoints", "Git history", "Node modules", "Docker images", "K8s pods", "YAML files"
    };

    String[] modifiers = {
        "with style", "at 3 AM", "like a pro", "violently", "with a smile",
        "for the 10th time", "by mistake", "on purpose", "super fast", "silently",
        "with extreme prejudice", "using magic", "efficiently", "accidentally", "intentionally",
        "completely", "partially", "magically", "securely", "dangerously", "smoothly"
    };

    for (int i = 0; i < 500; i++) {
      String title = verbs[random.nextInt(verbs.length)] + " " +
          subjects[random.nextInt(subjects.length)] + " " +
          modifiers[random.nextInt(modifiers.length)];

      boolean completed = random.nextBoolean();
      int priority = random.nextInt(5) + 1;
      OffsetDateTime createdAt = OffsetDateTime.now(ZoneOffset.UTC).minusDays(random.nextInt(20));
      OffsetDateTime completedAt = completed ? createdAt.plusHours(random.nextInt(48)) : null;

      Todo todo = new Todo(null, title, completed, priority, createdAt, completedAt);
      todoRepository.save(todo);
    }
  }

  private Permission getOrCreatePermission(String name, String description) {
    return permissionRepository.findByName(name)
        .orElseGet(() -> permissionRepository.save(new Permission(null, name, description)));
  }

  private Role getOrCreateRole(String name, String description, Set<Permission> permissions) {
    return roleRepository.findByName(name)
        .orElseGet(() -> {
          Role role = roleRepository.save(new Role(null, name, description, Collections.emptySet()));
          Set<RolePermission> rps = permissions.stream()
              .map(p -> new RolePermission(null, role, p))
              .collect(Collectors.toSet());
          return roleRepository.update(new Role(role.id(), role.name(), role.description(), rps));
        });
  }

  private void createUserIfNotExists(String email, String password, String fullname, Set<Role> roles) {
    if (!userRepository.existsByEmail(email)) {
      String hashedPassword = BCrypt.withDefaults().hashToString(12, password.toCharArray());
      String username = email.split("@")[0];
      User user = userRepository
          .save(new User(null, email, username, fullname, hashedPassword, Collections.emptySet()));
      Set<UserRole> userRoles = roles.stream()
          .map(r -> new UserRole(null, user, r))
          .collect(Collectors.toSet());
      userRepository
          .update(new User(user.id(), user.email(), user.username(), user.fullname(), user.password(), userRoles));
    }
  }
}
