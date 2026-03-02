package com.example.todo.sql;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import com.example.todo.sql.api.dto.SqlQueryRequest;
import com.example.todo.sql.api.dto.SqlResult;

import static org.junit.jupiter.api.Assertions.*;

@MicronautTest
class SqlControllerTest {

  @Inject
  @Client("${micronaut.server.context-path:}/api/sql")
  HttpClient client;

  @Test
  void testExecuteQuerySelect() {
    SqlQueryRequest req = new SqlQueryRequest("SELECT 1 as num", null, null);
    SqlResult result = client.toBlocking().retrieve(HttpRequest.POST("/", req),
        SqlResult.class);

    assertTrue(result.success());
    assertNull(result.errorMessage());
    assertEquals(1, result.columns().size());
    assertEquals("num", result.columns().get(0));
    assertEquals(1, result.rows().size());
    assertEquals(1, ((Number) result.rows().get(0).get("num")).intValue());
  }

  @Test
  void testExecuteQueryUpdate() {
    SqlQueryRequest req = new SqlQueryRequest(
        "CREATE TABLE if not exists test_table (id INTEGER)", null, null);
    SqlResult result = client.toBlocking().retrieve(HttpRequest.POST("/", req),
        SqlResult.class);

    assertTrue(result.success());
    assertEquals(1, result.columns().size());
    assertEquals("rowsAffected", result.columns().get(0));

    SqlQueryRequest insertReq = new SqlQueryRequest("INSERT INTO test_table VALUES (1)",
        null, null);
    SqlResult insertResult = client.toBlocking().retrieve(HttpRequest.POST("/", insertReq),
        SqlResult.class);
    assertTrue(insertResult.success());
  }

  @Test
  void testExecuteQueryError() {
    SqlQueryRequest req = new SqlQueryRequest("SELECT * FROM non_existent_table", null,
        null);
    SqlResult result = client.toBlocking().retrieve(HttpRequest.POST("/", req),
        SqlResult.class);

    assertFalse(result.success());
    assertNotNull(result.errorMessage());
    System.out.println("ACTUAL ERROR MSG: " + result.errorMessage());
    assertTrue(result.errorMessage().contains("non_existent_table")
        || result.errorMessage().toLowerCase().contains("not found"));
    assertNull(result.columns());
    assertNull(result.rows());
  }
}
