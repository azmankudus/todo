package com.example.todo;

import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.micronaut.http.MediaType;

@Controller(value = "/api/sql", produces = MediaType.APPLICATION_JSON, consumes = MediaType.APPLICATION_JSON)
public class SqlController {

  private static final Logger log = LoggerFactory.getLogger(SqlController.class);
  private final DataSource dataSource;

  @Inject
  public SqlController(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  @Post
  @Transactional
  public SqlResult executeQuery(@Body SqlQueryRequest request) {
    if (log.isDebugEnabled()) {
      log.debug("POST /sql - Executing SQL query");
    }
    if (log.isTraceEnabled()) {
      log.trace("Query: {}", request.query());
    }
    List<Map<String, Object>> rows = new ArrayList<>();
    List<String> columns = new ArrayList<>();

    try (Connection conn = dataSource.getConnection();
        Statement stmt = conn.createStatement()) {

      boolean isResultSet = stmt.execute(request.query());

      if (isResultSet) {
        try (ResultSet rs = stmt.getResultSet()) {
          ResultSetMetaData metaData = rs.getMetaData();
          int columnCount = metaData.getColumnCount();

          for (int i = 1; i <= columnCount; i++) {
            columns.add(metaData.getColumnName(i));
          }

          while (rs.next()) {
            Map<String, Object> row = new HashMap<>();
            for (int i = 1; i <= columnCount; i++) {
              row.put(metaData.getColumnName(i), rs.getObject(i));
            }
            rows.add(row);
          }
        }
      } else {
        int updateCount = stmt.getUpdateCount();
        Map<String, Object> countRow = new HashMap<>();
        countRow.put("rowsAffected", updateCount);
        rows.add(countRow);
        columns.add("rowsAffected");
        if (log.isTraceEnabled()) {
          log.trace("Mutation executed. Rows affected: {}", updateCount);
        }
      }

      if (log.isDebugEnabled()) {
        log.debug("SQL query executed successfully");
      }
      return new SqlResult(true, null, rows, columns);

    } catch (Exception e) {
      if (log.isDebugEnabled()) {
        log.debug("SQL query failed", e);
      }
      return new SqlResult(false, e.getMessage(), null, null);
    }
  }

  @Serdeable
  public record SqlQueryRequest(String query) {
  }

  @Serdeable
  public record SqlResult(boolean success, String errorMessage, List<Map<String, Object>> rows, List<String> columns) {
  }
}
