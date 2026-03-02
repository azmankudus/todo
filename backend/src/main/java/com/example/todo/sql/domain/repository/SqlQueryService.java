package com.example.todo.sql.domain.repository;

import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import javax.sql.DataSource;

import com.example.todo.sql.domain.model.SqlQueryResult;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Singleton
public class SqlQueryService {

  private static final Logger logger = LoggerFactory.getLogger(SqlQueryService.class.getName());

  private final DataSource dataSource;

  public SqlQueryService(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  @Transactional
  public SqlQueryResult execute(String query, int page, int size) throws Exception {
    List<Map<String, Object>> rows = new ArrayList<>();
    List<String> columns = new ArrayList<>();
    Map<String, String> columnTypes = new HashMap<>();
    long totalRows = 0;

    try (Connection conn = dataSource.getConnection();
        Statement stmt = conn.createStatement()) {

      String trimmedQuery = query.trim();
      boolean isSelect = trimmedQuery.toUpperCase().startsWith("SELECT");

      if (logger.isDebugEnabled()) {
        logger.debug("Executing SQL query (isSelect: {})", isSelect);
      }
      if (logger.isTraceEnabled()) {
        logger.trace("Full SQL query: {}", trimmedQuery);
      }

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
          processResultSet(rs, columns, columnTypes, rows);
        }
      } else {
        // Non-SELECT
        boolean isResultSet = stmt.execute(trimmedQuery);
        if (isResultSet) {
          try (ResultSet rs = stmt.getResultSet()) {
            processResultSet(rs, columns, columnTypes, rows);
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
        }
      }
      return new SqlQueryResult(true, null, rows, columns, columnTypes, totalRows);

    }
  }

  private void processResultSet(ResultSet rs, List<String> columns, Map<String, String> columnTypes,
      List<Map<String, Object>> rows) throws Exception {
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
}
