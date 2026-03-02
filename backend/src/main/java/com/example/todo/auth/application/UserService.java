package com.example.todo.auth.application;

import com.example.todo.auth.domain.model.User;
import com.example.todo.auth.domain.repository.UserRepository;
import jakarta.inject.Singleton;
import at.favre.lib.crypto.bcrypt.BCrypt;

import java.util.Optional;

@Singleton
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public boolean existsByEmail(String email) {
    return userRepository.existsByEmail(email);
  }

  public boolean existsByUsername(String username) {
    return userRepository.existsByUsername(username);
  }

  public User register(User user) {
    String hashedPassword = BCrypt.withDefaults().hashToString(12, user.password().toCharArray());
    User toSave = new User(
        user.id(),
        user.email(),
        user.username(),
        user.fullname(),
        hashedPassword,
        user.roles());
    return userRepository.save(toSave);
  }

  public Optional<User> findById(Integer id) {
    return userRepository.findById(id);
  }
}
