package com.example.todo.auth.application;

import com.example.todo.auth.api.dto.RegisterRequest;
import com.example.todo.auth.api.dto.UserInfo;
import com.example.todo.auth.domain.model.User;

import jakarta.inject.Singleton;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class UserMapper {

  public User toEntity(RegisterRequest request) {
    if (request == null) {
      return null;
    }

    return new User(
        null,
        request.email(),
        request.username(),
        request.fullname(),
        request.password(),
        Collections.emptySet());
  }

  public UserInfo toUserInfo(User user) {
    if (user == null) {
      return null;
    }

    List<String> roleNames = user.roles() != null
        ? user.roles().stream().map(ur -> ur.role().name())
            .collect(Collectors.toList())
        : Collections.emptyList();

    return new UserInfo(
        user.id(),
        user.email(),
        user.username(),
        user.fullname(),
        roleNames);
  }
}
