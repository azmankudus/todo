package com.example.todo;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@MicronautTest
class SqlControllerTest {

  @Inject
  @Client("${micronaut.server.context-path:}/api/sql")
  HttpClient client;

  @Test
  void testExecuteQuerySelect() {
    SqlController.SqlQueryRequest req = new SqlController.SqlQueryRequest("SELECT 1 as num");
    SqlController.SqlResult result = client.toBlocking().retrieve(HttpRequest.POST("/", req),
        SqlController.SqlResult.class);

    assertTrue(result.success());
    assertNull(result.errorMessage());
    assertEquals(1, result.columns().size());
    assertEquals("num", result.columns().get(0));
    assertEquals(1, result.rows().size());
    assertEquals(1, ((Number) result.rows().get(0).get("num")).intValue());
  }

  @Test
  void testExecuteQueryUpdate() {
    SqlController.SqlQueryRequest req = new SqlController.SqlQueryRequest(
        "CREATE TABLE if not exists test_table (id INTEGER)");
    SqlController.SqlResult result = client.toBlocking().retrieve(HttpRequest.POST("/", req),
        SqlController.SqlResult.class);

    assertTrue(result.success());
    assertEquals(1, result.columns().size());
    assertEquals("rowsAffected", result.columns().get(0));

    SqlController.SqlQueryRequest insertReq = new SqlController.SqlQueryRequest("INSERT INTO test_table VALUES (1)");
    SqlController.SqlResult insertResult = client.toBlocking().retrieve(HttpRequest.POST("/", insertReq),
        SqlController.SqlResult.class);
    assertTrue(insertResult.success());
  }

  @Test
  void testExecuteQueryError() {
    SqlController.SqlQueryRequest req = new SqlController.SqlQueryRequest("SELECT * FROM non_existent_table");
    SqlController.SqlResult result = client.toBlocking().retrieve(HttpRequest.POST("/", req),
        SqlController.SqlResult.class);

    assertFalse(result.success());
    assertNotNull(result.errorMessage());
    System.out.println("ACTUAL ERROR MSG: " + result.errorMessage());
    assertTrue(result.errorMessage().contains("non_existent_table")
        || result.errorMessage().toLowerCase().contains("not found"));
    assertNull(result.columns());
    assertNull(result.rows());
  }
}
