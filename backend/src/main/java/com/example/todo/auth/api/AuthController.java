package com.example.todo.auth.api;

import com.example.todo.shared.api.RequestStatus;
import com.example.todo.shared.error.ApplicationException;
import com.example.todo.auth.api.dto.RegisterRequest;
import com.example.todo.auth.application.UserMapper;
import com.example.todo.auth.application.UserService;
import com.example.todo.auth.domain.model.User;
import com.example.todo.auth.domain.model.Role;
import com.example.todo.auth.domain.model.UserRole;

import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.token.generator.AccessRefreshTokenGenerator;
import io.micronaut.validation.Validated;
import jakarta.validation.Valid;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.todo.shared.util.HttpResponseUtil;
import com.example.todo.shared.util.UuidUtil;

import io.micronaut.security.rules.SecurityRule;

@Secured(SecurityRule.IS_AUTHENTICATED)
@Controller(value = "/api/auth", produces = MediaType.APPLICATION_JSON, consumes = MediaType.APPLICATION_JSON)
@Validated
public class AuthController {

  private static final Logger logger = LoggerFactory.getLogger(AuthController.class.getName());

  private final UserService userService;
  private final UserMapper userMapper;
  private final AccessRefreshTokenGenerator tokenGenerator;

  public AuthController(
      UserService userService,
      UserMapper userMapper,
      AccessRefreshTokenGenerator tokenGenerator) {
    this.userService = userService;
    this.userMapper = userMapper;
    this.tokenGenerator = tokenGenerator;
  }

  @Post("/register")
  @Secured(SecurityRule.IS_ANONYMOUS)
  public MutableHttpResponse<Map<String, Object>> register(@Valid @Body RegisterRequest request)
      throws ApplicationException {
    OffsetDateTime startTime = OffsetDateTime.now();
    String requestId = "AUTH-" + UuidUtil.timeBasedUuidString();

    if (logger.isDebugEnabled()) {
      logger.debug("Registration attempt for email: {}, username: {} (Request ID: {})", request.email(),
          request.username(), requestId);
    }

    if (userService.existsByEmail(request.email())) {
      logger.warn("Registration failed: Email {} already exists (Request ID: {})", request.email(), requestId);

      return HttpResponseUtil.create(
          HttpStatus.BAD_REQUEST,
          requestId,
          RequestStatus.ERROR,
          "ERR-00000001",
          "Email already registered",
          startTime,
          null);
    }

    if (userService.existsByUsername(request.username())) {
      logger.warn("Registration failed: Username {} already exists (Request ID: {})", request.username(), requestId);

      return HttpResponseUtil.create(
          HttpStatus.BAD_REQUEST,
          requestId,
          RequestStatus.ERROR,
          "ERR-00000004",
          "Username already taken",
          startTime,
          null);
    }

    User user = userMapper.toEntity(request);
    User saved = userService.register(user);

    // Generate tokens for the new user
    Map<String, Object> attributes = new HashMap<>();
    attributes.put("id", saved.id());
    attributes.put("email", saved.email());
    attributes.put("username", saved.username());
    attributes.put("fullname", saved.fullname());
    attributes.put("roles", saved.roles().stream().map(UserRole::role).map(Role::name).collect(Collectors.toList()));

    Authentication authentication = Authentication.build(saved.email(), attributes);

    return tokenGenerator.generate(authentication)
        .map(art -> {
          Map<String, Object> body = new HashMap<>();
          body.put("accessToken", art.getAccessToken());
          body.put("refreshToken", art.getRefreshToken());
          body.put("user", userMapper.toUserInfo(saved));
          return HttpResponseUtil.create(
              HttpStatus.CREATED,
              requestId,
              RequestStatus.SUCCESS,
              "",
              "Registration success",
              startTime,
              body);
        })
        .orElseThrow(() -> new ApplicationException(requestId, startTime, "ERR-00000002", "Token generation failed"));
  }

  @Get("/me")
  @Secured(SecurityRule.IS_AUTHENTICATED)
  public MutableHttpResponse<Map<String, Object>> me(Authentication authentication) throws ApplicationException {
    OffsetDateTime startTime = OffsetDateTime.now();
    String requestId = "AUTH-" + UuidUtil.timeBasedUuidString();

    if (authentication == null) {
      return unauthorized(requestId, startTime);
    }

    Object idObj = authentication.getAttributes().get("id");
    if (idObj == null) {
      return unauthorized(requestId, startTime);
    }

    Integer id = idObj instanceof Number ? ((Number) idObj).intValue() : Integer.parseInt(idObj.toString());

    return userService.findById(id)
        .map(user -> HttpResponseUtil.create(
            HttpStatus.OK,
            requestId,
            RequestStatus.SUCCESS,
            "",
            "User info fetched",
            startTime,
            Map.of("user", userMapper.toUserInfo(user))))
        .orElse(unauthorized(requestId, startTime));
  }

  private MutableHttpResponse<Map<String, Object>> unauthorized(String requestId, OffsetDateTime startTime) {
    return HttpResponseUtil.create(
        HttpStatus.UNAUTHORIZED,
        requestId,
        RequestStatus.ERROR,
        "ERR-00000003",
        "Not authorized",
        startTime,
        null);
  }
}
