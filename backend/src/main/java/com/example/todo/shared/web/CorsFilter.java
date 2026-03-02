package com.example.todo.shared.web;

import io.micronaut.context.annotation.Property;
import io.micronaut.http.HttpMethod;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Custom CORS filter that adds Access-Control headers exactly once.
 * Also strips content-encoding to avoid ERR_CONTENT_DECODING_FAILED in
 * cross-origin browser fetches.
 */
@Filter("/**")
public class CorsFilter implements HttpServerFilter {

  private static final Logger logger = LoggerFactory.getLogger(CorsFilter.class);
  private static final String ACAO = "Access-Control-Allow-Origin";

  private final List<String> allowedOrigins;

  public CorsFilter(
      @Property(name = "application.cors.allowed-origins", defaultValue = "http://localhost:3000") String allowedOrigins) {
    this.allowedOrigins = List.of(allowedOrigins.split(","));
    logger.info("CORS filter initialized with allowed origins: {}", this.allowedOrigins);
  }

  @Override
  public int getOrder() {
    return -100;
  }

  @Override
  public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
    String origin = request.getHeaders().get("Origin");

    // Handle preflight OPTIONS requests
    if (request.getMethod() == HttpMethod.OPTIONS && origin != null) {
      MutableHttpResponse<?> response = HttpResponse.ok();
      addCorsHeaders(response, origin);
      return Mono.just(response);
    }

    // For normal requests, proceed through chain then add headers
    return Flux.from(chain.proceed(request))
        .map(response -> {
          addCorsHeaders(response, origin);

          // Strip content-encoding for cross-origin requests to prevent
          // ERR_CONTENT_DECODING_FAILED in browsers
          if (origin != null && response.getHeaders().contains("Content-Encoding")) {
            response.getHeaders().remove("Content-Encoding");
          }

          return response;
        });
  }

  private void addCorsHeaders(MutableHttpResponse<?> response, String origin) {
    if (origin == null) {
      return;
    }

    // Only add if not already present
    if (response.getHeaders().contains(ACAO)) {
      return;
    }

    if (allowedOrigins.contains(origin.trim())) {
      response.header(ACAO, origin);
      response.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      response.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
      response.header("Access-Control-Allow-Credentials", "true");
      response.header("Vary", "Origin");
    }
  }
}
