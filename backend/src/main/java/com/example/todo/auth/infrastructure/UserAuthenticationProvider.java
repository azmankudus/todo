package com.example.todo.auth.infrastructure;

import io.micronaut.core.annotation.Nullable;
import com.example.todo.auth.domain.model.Role;
import io.micronaut.http.HttpRequest;
import io.micronaut.security.authentication.AuthenticationRequest;
import io.micronaut.security.authentication.AuthenticationResponse;
import io.micronaut.security.authentication.provider.AuthenticationProvider;
import jakarta.inject.Singleton;
import at.favre.lib.crypto.bcrypt.BCrypt;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.todo.auth.domain.repository.UserRepository;

@Singleton
public class UserAuthenticationProvider implements AuthenticationProvider<HttpRequest<?>, String, String> {

  private static final Logger logger = LoggerFactory.getLogger(UserAuthenticationProvider.class.getName());

  private final UserRepository userRepository;

  public UserAuthenticationProvider(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public AuthenticationResponse authenticate(@Nullable HttpRequest<?> httpRequest,
      AuthenticationRequest<String, String> authenticationRequest) {
    String identity = authenticationRequest.getIdentity();
    String password = authenticationRequest.getSecret();

    return userRepository.findByUsernameOrEmail(identity, identity)
        .filter(user -> {
          boolean verified = BCrypt.verifyer().verify(password.toCharArray(), user.password()).verified;
          if (!verified) {
            logger.warn("Authentication failed: Invalid password for user {}", identity);
          }
          return verified;
        })
        .map(user -> {
          if (logger.isDebugEnabled()) {
            logger.debug("Authentication successful for user: {}", user.email());
          }
          Map<String, Object> attributes = new HashMap<>();
          attributes.put("id", user.id());
          attributes.put("email", user.email());
          attributes.put("username", user.username());
          attributes.put("fullname", user.fullname());
          List<String> authorities = new ArrayList<>();
          if (user.roles() != null) {
            user.roles().forEach(ur -> {
              Role role = ur.role();
              authorities.add(role.name());
              if (role.permissions() != null) {
                role.permissions().forEach(rp -> authorities.add(rp.permission().name()));
              }
            });
          }

          return AuthenticationResponse.success(
              user.email(),
              authorities,
              attributes);
        })
        .orElseGet(() -> {
          logger.warn("Authentication failed: User {} not found", identity);
          return AuthenticationResponse.failure();
        });
  }
}
