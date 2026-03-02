package com.example.todo.shared.web;

import io.micronaut.context.annotation.Requires;
import io.micronaut.context.annotation.Value;
import io.micronaut.context.annotation.Property;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import org.reactivestreams.Publisher;
import io.micronaut.core.annotation.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;
import com.example.todo.shared.util.HttpResponseUtil;
import com.example.todo.shared.util.UuidUtil;
import com.example.todo.shared.api.RequestStatus;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Filter("/**")
@Requires(property = "application.test.alwayserror.enabled", value = "true", defaultValue = "false")
public class AlwaysErrorFilter implements HttpServerFilter {

  private static final Logger logger = LoggerFactory.getLogger(AlwaysErrorFilter.class.getName());

  private final String contextPath;
  private final List<String> apiPaths;

  public AlwaysErrorFilter(@Property(name = "application.test.alwayserror.api") @Nullable List<String> apiPaths,
      @Value("${micronaut.server.context-path:/}") String contextPath) {
    this.apiPaths = apiPaths != null ? apiPaths : List.of();
    this.contextPath = contextPath;
    logger.info("Always Error filter enabled for paths: {}", this.apiPaths);
  }

  @Override
  public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
    String path = request.getPath();
    boolean match = apiPaths.stream().anyMatch(apiPath -> path.startsWith(contextPath + apiPath));

    logger.debug("Always Error filter intercepting request: {}", path);

    if (match) {
      logger.warn("Intercepted request to error-prone path: {}. Returning simulated 500 error.", path);

      OffsetDateTime startTime = OffsetDateTime.now();
      String traceId = "ERR-" + UuidUtil.timeBasedUuidString();

      return Mono.just(HttpResponseUtil.create(
          HttpStatus.INTERNAL_SERVER_ERROR,
          traceId,
          RequestStatus.ERROR,
          "SIMULATED_ERROR",
          "This is a simulated error for testing exception handling on the frontend.",
          startTime,
          Map.of(
              "stackTrace", "java.lang.RuntimeException: Simulated error at " + path + "\n" +
                  "\tat com.example.todo.shared.web.AlwaysErrorFilter.doFilter(AlwaysErrorFilter.java:123)\n" +
                  "\tat io.micronaut.http.filter.ServerFilterChain.proceed(ServerFilterChain.java:100)",
              "path", path,
              "timestamp", startTime.toString())));
    }

    return chain.proceed(request);
  }
}
