package com.example.todo.shared.web;

import io.micronaut.context.annotation.Requires;
import io.micronaut.context.annotation.Value;
import io.micronaut.context.annotation.Property;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import org.reactivestreams.Publisher;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import io.micronaut.core.annotation.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.Duration;
import java.util.List;

import reactor.core.publisher.Mono;

@Filter("/**")
@Requires(property = "application.test.delay.enabled", value = "true", defaultValue = "false")
@ExecuteOn(TaskExecutors.IO)
public class DelayFilter implements HttpServerFilter {

  private static final Logger logger = LoggerFactory.getLogger(DelayFilter.class.getName());

  private final long delayDuration;
  private final List<String> apiPaths;
  private final String contextPath;

  public DelayFilter(@Property(name = "application.test.delay.duration") @Nullable Long delayDuration,
      @Property(name = "application.test.delay.api") @Nullable List<String> apiPaths,
      @Value("${micronaut.server.context-path:/}") String contextPath) {
    this.delayDuration = delayDuration != null ? delayDuration : 3L;
    this.apiPaths = apiPaths != null ? apiPaths : List.of();
    this.contextPath = contextPath;
    logger.info("Delay filter enabled with duration: {}ms", this.delayDuration);
  }

  @Override
  public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
    String path = request.getPath();
    boolean match = apiPaths.stream().anyMatch(apiPath -> path.startsWith(contextPath + apiPath));

    logger.debug("Delay filter intercepting request: {}", path);

    if (!match) {
      return chain.proceed(request);
    }

    logger.info("Applying artificial delay of {}ms to request: {}", delayDuration, path);

    return Mono.delay(Duration.ofSeconds(delayDuration))
        .flatMap(d -> Mono.from(chain.proceed(request)));
  }
}
