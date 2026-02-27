package com.example.todo;

import io.micronaut.runtime.Micronaut;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@OpenAPIDefinition(info = @Info(title = "Todo API", version = "0.0.1", description = "My Todo API"))
public class Main {
  private static final Logger log = LoggerFactory.getLogger(Main.class);

  public static void main(String[] args) {
    log.info("Starting up Todo application...");

    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
      log.info("Graceful shutdown initiated...");
      log.info("Application shut down successfully.");
    }));

    Micronaut.build(args)
        .classes(Main.class)
        .banner(false)
        .start();

    log.info("Application started and ready to serve requests.");
  }
}
