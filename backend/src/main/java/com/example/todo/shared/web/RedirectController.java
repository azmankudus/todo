package com.example.todo.shared.web;

import io.micronaut.context.annotation.Value;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

import java.net.URI;

@Secured(SecurityRule.IS_ANONYMOUS)
@Controller("/")
public class RedirectController {

  @Value("${micronaut.server.context-path:/}")
  protected String contextPath;

  @Get
  public HttpResponse<?> index() {
    String path = contextPath.endsWith("/") ? contextPath + "ui/" : contextPath + "/ui/";
    return HttpResponse.redirect(URI.create(path));
  }
}
