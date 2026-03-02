package com.example.todo.shared.logging;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Filter("/**")
public class LoggingFilter implements HttpServerFilter {

  private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class.getName());

  @Override
  public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
    String method = request.getMethodName();
    String path = request.getPath();
    String origin = request.getHeaders().getOrigin().orElse("No-Origin");

    if (logger.isTraceEnabled()) {
      logger.trace("Incoming Request: {} {} from {} (Headers: {})", method, path, origin, request.getHeaders().asMap());
    } else if (logger.isDebugEnabled()) {
      logger.debug("Incoming Request: {} {} from {}", method, path, origin);
    }

    return chain.proceed(request);
  }
}
