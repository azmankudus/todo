package com.example.todo;

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
  private static final Logger LOG = LoggerFactory.getLogger(LoggingFilter.class);

  @Override
  public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
    String method = request.getMethodName();
    String path = request.getPath();
    String origin = request.getHeaders().getOrigin().orElse("No-Origin");

    LOG.info("Incoming Request: {} {} from {}", method, path, origin);

    return chain.proceed(request);
  }
}
