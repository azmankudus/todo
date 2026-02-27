package com.example.todo;

import io.micronaut.context.annotation.Value;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import java.net.URI;

@Controller("/")
public class RedirectController {

  @Value("${micronaut.server.context-path:/}")
  protected String contextPath;

  @Get
  public HttpResponse<?> index() {
    String path = contextPath.endsWith("/") ? contextPath + "ui" : contextPath + "/ui";
    return HttpResponse.redirect(URI.create(path));
  }
}
