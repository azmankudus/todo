package com.example.todo;

import io.micronaut.context.annotation.Requires;
import io.micronaut.context.annotation.Property;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import org.reactivestreams.Publisher;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;

@Filter("/**")
@Requires(property = "application.delay.enabled", value = "true", defaultValue = "false")
@ExecuteOn(TaskExecutors.IO)
public class DelayFilter implements HttpServerFilter {

  private final long delayDuration;

  public DelayFilter(@Property(name = "application.delay.duration", defaultValue = "3000") long delayDuration) {
    this.delayDuration = delayDuration;
  }

  @Override
  public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
    String path = request.getPath();
    if (path.startsWith("/api") || path.startsWith("/todo") || path.startsWith("/sql")) {
      try {
        Thread.sleep(delayDuration);
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
      }
    }
    return chain.proceed(request);
  }
}
