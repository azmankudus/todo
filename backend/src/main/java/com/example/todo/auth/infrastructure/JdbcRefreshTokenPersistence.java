package com.example.todo.auth.infrastructure;

import com.example.todo.auth.domain.model.RefreshToken;
import com.example.todo.auth.domain.repository.RefreshTokenRepository;
import com.example.todo.auth.domain.repository.UserRepository;
import com.example.todo.auth.domain.model.Role;
import com.example.todo.auth.domain.model.UserRole;

import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.token.event.RefreshTokenGeneratedEvent;
import io.micronaut.security.token.refresh.RefreshTokenPersistence;
import jakarta.inject.Singleton;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Flux;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Singleton
public class JdbcRefreshTokenPersistence implements RefreshTokenPersistence {

  private static final Logger logger = LoggerFactory.getLogger(JdbcRefreshTokenPersistence.class.getName());

  private final RefreshTokenRepository refreshTokenRepository;
  private final UserRepository userRepository;

  public JdbcRefreshTokenPersistence(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
    this.refreshTokenRepository = refreshTokenRepository;
    this.userRepository = userRepository;
  }

  @Override
  public void persistToken(RefreshTokenGeneratedEvent event) {
    if (event != null && event.getRefreshToken() != null && event.getAuthentication() != null) {
      String payload = event.getRefreshToken();
      Authentication authentication = event.getAuthentication();
      Object idObj = authentication.getAttributes().get("id");
      Integer userId = idObj instanceof Number ? ((Number) idObj).intValue()
          : Integer.parseInt(idObj.toString());

      if (logger.isDebugEnabled()) {
        logger.debug("Persisting refresh token for user ID: {}", userId);
      }

      RefreshToken refreshToken = new RefreshToken(
          null,
          userId,
          payload,
          OffsetDateTime.now().plusDays(7),
          null);
      refreshTokenRepository.save(refreshToken);
    }
  }

  @Override
  public Publisher<Authentication> getAuthentication(String refreshToken) {
    if (logger.isDebugEnabled()) {
      logger.debug("Getting authentication from refresh token");
    }
    return Flux.create(emitter -> refreshTokenRepository.findByToken(refreshToken).ifPresentOrElse(
        token -> {
          if (token.expiresAt().isAfter(OffsetDateTime.now())) {
            userRepository.findById(token.userId()).ifPresentOrElse(
                user -> {
                  if (logger.isDebugEnabled()) {
                    logger.debug("Refresh token authentication successful for user: {}", user.email());
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
                      authorities.add("ROLE_" + role.name());
                      if (role.permissions() != null) {
                        role.permissions().forEach(rp -> authorities.add(rp.permission().name()));
                      }
                    });
                  }

                  attributes.put("roles",
                      user.roles().stream().map(ur -> ur.role().name()).collect(Collectors.toList()));

                  emitter.next(Authentication.build(user.email(), authorities, attributes));
                  emitter.complete();
                },
                () -> {
                  logger.warn("Refresh failed: User not found for ID {}", token.userId());
                  emitter.error(new RuntimeException("User not found"));
                });
          } else {
            logger.warn("Refresh failed: Token expired for user ID {}", token.userId());
            refreshTokenRepository.delete(token);
            emitter.error(new RuntimeException("Refresh token expired"));
          }
        },
        () -> {
          logger.warn("Refresh failed: Token not found");
          emitter.error(new RuntimeException("Refresh token not found"));
        }));
  }
}
