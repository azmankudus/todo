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

    int page = request.page() != null ? Math.max(1, request.page()) : 1;
    int size = request.size() != null ? Math.max(1, Math.min(1000, request.size())) : 10;

    List<Map<String, Object>> rows = new ArrayList<>();
    List<String> columns = new ArrayList<>();
    Map<String, String> columnTypes = new HashMap<>();
    long totalRows = 0;

    try (Connection conn = dataSource.getConnection();
        Statement stmt = conn.createStatement()) {

      String trimmedQuery = request.query().trim();
      boolean isSelect = trimmedQuery.toUpperCase().startsWith("SELECT");

      if (isSelect) {
        // Count total rows first
        String countSql = "SELECT COUNT(*) FROM (" + trimmedQuery.replaceAll(";\\s*$", "") + ") AS _count_query";
        try (ResultSet countRs = stmt.executeQuery(countSql)) {
          if (countRs.next()) {
            totalRows = countRs.getLong(1);
          }
        }

        // Execute paginated query
        int offset = (page - 1) * size;
        String paginatedSql = trimmedQuery.replaceAll(";\\s*$", "") + " LIMIT " + size + " OFFSET " + offset;

        try (ResultSet rs = stmt.executeQuery(paginatedSql)) {
          ResultSetMetaData metaData = rs.getMetaData();
          int columnCount = metaData.getColumnCount();

          for (int i = 1; i <= columnCount; i++) {
            String colName = metaData.getColumnName(i);
            columns.add(colName);
            columnTypes.put(colName, metaData.getColumnTypeName(i));
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
        // Non-SELECT (INSERT, UPDATE, DELETE, etc.)
        boolean isResultSet = stmt.execute(trimmedQuery);
        if (isResultSet) {
          try (ResultSet rs = stmt.getResultSet()) {
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            for (int i = 1; i <= columnCount; i++) {
              String colName = metaData.getColumnName(i);
              columns.add(colName);
              columnTypes.put(colName, metaData.getColumnTypeName(i));
            }
            while (rs.next()) {
              Map<String, Object> row = new HashMap<>();
              for (int i = 1; i <= columnCount; i++) {
                row.put(metaData.getColumnName(i), rs.getObject(i));
              }
              rows.add(row);
            }
          }
          totalRows = rows.size();
        } else {
          int updateCount = stmt.getUpdateCount();
          Map<String, Object> countRow = new HashMap<>();
          countRow.put("rowsAffected", updateCount);
          rows.add(countRow);
          columns.add("rowsAffected");
          columnTypes.put("rowsAffected", "INTEGER");
          totalRows = 1;
          if (log.isTraceEnabled()) {
            log.trace("Mutation executed. Rows affected: {}", updateCount);
          }
        }
      }

      if (log.isDebugEnabled()) {
        log.debug("SQL query executed successfully. Total rows: {}, Page: {}, Size: {}", totalRows, page, size);
      }
      return new SqlResult(true, null, rows, columns, columnTypes, totalRows, page, size);

    } catch (Exception e) {
      if (log.isDebugEnabled()) {
        log.debug("SQL query failed", e);
      }
      return new SqlResult(false, e.getMessage(), null, null, null, 0, page, size);
    }
  }

  @Serdeable
  public record SqlQueryRequest(String query, Integer page, Integer size) {
  }

  @Serdeable
  public record SqlResult(boolean success, String errorMessage, List<Map<String, Object>> rows, List<String> columns,
      Map<String, String> columnTypes, long totalRows, int page, int size) {
  }
}
