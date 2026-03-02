package com.example.todo.modules.auth.infrastructure;

import io.micronaut.context.annotation.Replaces;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.token.bearer.AccessRefreshTokenLoginHandler;
import io.micronaut.security.token.generator.AccessRefreshTokenGenerator;
import io.micronaut.security.token.render.AccessRefreshToken;
import jakarta.inject.Singleton;

import java.util.HashMap;
import java.util.Map;
import java.time.OffsetDateTime;

import com.example.todo.shared.api.RequestStatus;
import com.example.todo.shared.util.HttpResponseUtil;
import com.example.todo.shared.util.UuidUtil;

@Singleton
@Replaces(AccessRefreshTokenLoginHandler.class)
public class CustomLoginHandler extends AccessRefreshTokenLoginHandler {

  public CustomLoginHandler(AccessRefreshTokenGenerator accessRefreshTokenGenerator) {
    super(accessRefreshTokenGenerator);
  }

  @Override
  public MutableHttpResponse<?> loginSuccess(Authentication authentication, HttpRequest<?> request) {
    return wrapStandardResponse(super.loginSuccess(authentication, request), authentication, "Login successful");
  }

  @Override
  public MutableHttpResponse<?> loginRefresh(Authentication authentication, String refreshToken,
      HttpRequest<?> request) {
    return wrapStandardResponse(super.loginRefresh(authentication, refreshToken, request), authentication,
        "Token refresh successful");
  }

  private MutableHttpResponse<?> wrapStandardResponse(MutableHttpResponse<?> response, Authentication authentication,
      String message) {
    Object body = response.body();
    if (body instanceof AccessRefreshToken art) {
      OffsetDateTime startTime = OffsetDateTime.now();
      String requestId = "AUTH-" + UuidUtil.timeBasedUuidString();

      Map<String, Object> details = new HashMap<>();
      details.put("accessToken", art.getAccessToken());
      details.put("refreshToken", art.getRefreshToken());

      Map<String, Object> user = new HashMap<>();
      user.put("id", authentication.getAttributes().get("id"));
      user.put("email", authentication.getAttributes().get("email"));
      user.put("username", authentication.getAttributes().get("username"));
      user.put("fullname", authentication.getAttributes().get("fullname"));
      user.put("roles", authentication.getAttributes().get("roles"));

      details.put("user", user);

      return HttpResponseUtil.create(
          response.getStatus(),
          requestId,
          RequestStatus.SUCCESS,
          "",
          message,
          startTime,
          details);
    }
    return response;
  }
}
