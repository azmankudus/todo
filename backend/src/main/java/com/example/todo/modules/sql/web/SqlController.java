package com.example.todo.modules.sql.web;

import com.example.todo.shared.api.RequestStatus;
import com.example.todo.shared.error.ApplicationException;
import com.example.todo.shared.util.HttpResponseUtil;
import com.example.todo.shared.util.UuidUtil;
import com.example.todo.modules.sql.web.dto.SqlQueryRequest;
import com.example.todo.modules.sql.web.dto.SqlResult;
import com.example.todo.modules.sql.application.SqlMapper;
import com.example.todo.modules.sql.domain.model.SqlQueryResult;
import com.example.todo.modules.sql.domain.repository.SqlQueryService;

import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.security.annotation.Secured;

import java.time.OffsetDateTime;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Secured("admin:all")
@Controller(value = "/api/sql", produces = MediaType.APPLICATION_JSON, consumes = MediaType.APPLICATION_JSON)
public class SqlController {

  private static final Logger logger = LoggerFactory.getLogger(SqlController.class.getName());

  private final SqlQueryService sqlService;
  private final SqlMapper sqlMapper;

  public SqlController(SqlQueryService sqlService, SqlMapper sqlMapper) {
    this.sqlService = sqlService;
    this.sqlMapper = sqlMapper;
  }

  @Post

  public MutableHttpResponse<Map<String, Object>> executeQuery(@Body SqlQueryRequest request)
      throws ApplicationException {
    OffsetDateTime startTime = OffsetDateTime.now();
    String requestId = "SQL-" + UuidUtil.timeBasedUuidString();

    if (logger.isDebugEnabled()) {
      logger.debug("SQL query execution requested (Request ID: {})", requestId);
    }
    if (logger.isTraceEnabled()) {
      logger.trace("SQL query details: page={}, size={}, query='{}'", request.page(), request.size(), request.query());
    }

    int page = request.page() != null ? Math.max(1, request.page()) : 1;
    int size = request.size() != null ? Math.clamp(request.size(), 1, 1000) : 10;

    try {
      SqlQueryResult result = sqlService.execute(request.query(), page, size);
      SqlResult response = sqlMapper.toResponse(result, page, size);
      return HttpResponseUtil.create(
          HttpStatus.OK,
          requestId,
          RequestStatus.SUCCESS,
          "",
          "Query execution successful",
          startTime,
          Map.of("result", response));
    } catch (Exception e) {
      throw new ApplicationException(requestId, startTime, "SQL_EXECUTION_FAILED", e.getMessage(), e);
    }
  }
}
