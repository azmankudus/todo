package com.example.todo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.micronaut.runtime.Micronaut;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(info = @Info(title = "Todo API", version = "0.0.1", description = "My Todo API"))
public class Main {

  private static final Logger logger = LoggerFactory.getLogger(Main.class.getName());

  public static void main(String[] args) {
    logger.info("Starting up Todo application...");

    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
      logger.info("Graceful shutdown initiated...");
      logger.info("Application shut down successfully.");
    }));

    Micronaut.build(args)
        .classes(Main.class)
        .banner(false)
        .start();

    logger.info("Application started and ready to serve requests.");
  }
}
