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

    createUserIfNotExists("admin@example.com", "admin123", "System Admin", Set.of(adminRole));
    createUserIfNotExists("manager@example.com", "manager123", "Task Manager", Set.of(managerRole));
    createUserIfNotExists("user@example.com", "user123", "Regular User", Set.of(userRole));
  }

  private void initializeTodos() {
    if (todoRepository.count() > 0) {
      return;
    }

    logger.info("Seeding random todos...");
    Random random = new Random(42);
    String[] prefixes = { "Review", "Update", "Fix", "Implement", "Design" };
    String[] subjects = { "login page", "API", "database", "dashboard", "security" };

    for (int i = 0; i < 20; i++) {
      String title = prefixes[random.nextInt(prefixes.length)] + " " + subjects[random.nextInt(subjects.length)];
      boolean completed = random.nextBoolean();
      int priority = random.nextInt(5) + 1;
      OffsetDateTime createdAt = OffsetDateTime.now(ZoneOffset.UTC).minusDays(random.nextInt(10));
      OffsetDateTime completedAt = completed ? createdAt.plusHours(random.nextInt(24)) : null;

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
