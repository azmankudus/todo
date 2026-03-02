package com.example.todo.shared.web;

import io.micronaut.core.io.ResourceResolver;
import io.micronaut.http.server.types.files.StreamedFile;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

import java.net.URL;
import java.util.Optional;

@Secured(SecurityRule.IS_ANONYMOUS)
@Controller("/ui")
public class SpaController {

    private final ResourceResolver resourceResolver;

    public SpaController(ResourceResolver resourceResolver) {
        this.resourceResolver = resourceResolver;
    }

    @Get
    public HttpResponse<?> root() {
        return serveIndex();
    }

    // Catch-all for any SPA routes under /ui that don't match a physical file
    @Get("/{+path}")
    public HttpResponse<?> index(String path) {
        // Try to resolve the specific file first (e.g. css/js dependencies)
        if (path != null && !path.isEmpty()) {
            Optional<URL> resource = resourceResolver.getResource("classpath:public/ui/" + path);
            if (resource.isPresent() && !resource.get().getPath().endsWith("/")) {
                return HttpResponse.ok(new StreamedFile(resource.get()));
            }
        }

        return serveIndex();
    }

    private HttpResponse<?> serveIndex() {
        Optional<URL> index = resourceResolver.getResource("classpath:public/ui/index.html");
        if (index.isPresent()) {
            return HttpResponse.ok(new StreamedFile(index.get())).contentType(MediaType.TEXT_HTML);
        }
        return HttpResponse.notFound();
    }
}
