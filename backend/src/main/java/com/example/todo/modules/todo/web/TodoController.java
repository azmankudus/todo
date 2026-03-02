package com.example.todo.modules.todo.web;

import com.example.todo.shared.api.RequestStatus;
import com.example.todo.shared.error.ApplicationException;
import com.example.todo.modules.todo.web.dto.TodoRequest;
import com.example.todo.modules.todo.web.dto.TodoResponse;
import com.example.todo.modules.todo.application.TodoMapper;
import com.example.todo.modules.todo.application.TodoService;
import com.example.todo.modules.todo.domain.model.Todo;

import io.micronaut.cache.annotation.CacheInvalidate;
import io.micronaut.cache.annotation.Cacheable;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.model.Sort;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

import jakarta.validation.Valid;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.todo.shared.util.HttpResponseUtil;
import com.example.todo.shared.util.UuidUtil;

@Secured(SecurityRule.IS_AUTHENTICATED)
@Controller(value = "/api/todo", produces = MediaType.APPLICATION_JSON, consumes = MediaType.APPLICATION_JSON)
public class TodoController {

  private static final Logger logger = LoggerFactory.getLogger(TodoController.class.getName());

  private final TodoService todoService;
  private final TodoMapper todoMapper;

  public TodoController(TodoService todoService, TodoMapper todoMapper) {
    this.todoService = todoService;
    this.todoMapper = todoMapper;
  }

  @Secured("todo:read")
  @Cacheable("todos")
  @Get
  public MutableHttpResponse<Map<String, Object>> listTodos(
      @QueryValue(defaultValue = "0") int page,
      @QueryValue(defaultValue = "10") int size) throws ApplicationException {
    OffsetDateTime startTime = OffsetDateTime.now();
    String requestId = "TODO-" + UuidUtil.timeBasedUuidString();

    if (logger.isDebugEnabled()) {
      logger.debug("Fetching todos - page: {}, size: {} (Request ID: {})", page, size, requestId);
    }

    Pageable pageable = Pageable.from(page, size, Sort.of(Sort.Order.desc("createdAt")));
    Page<Todo> todoPage = todoService.findAll(pageable);

    List<TodoResponse> todos = todoPage.getContent().stream()
        .map(todoMapper::toResponse)
        .toList();

    return HttpResponseUtil.create(
        HttpStatus.OK,
        requestId,
        RequestStatus.SUCCESS,
        "",
        "Todos fetched",
        startTime,
        Map.of(
            "todos", todos,
            "totalRows", todoPage.getTotalSize(),
            "totalPages", todoPage.getTotalPages(),
            "currentPage", todoPage.getPageNumber() + 1,
            "pageSize", todoPage.getSize()));
  }

  @Secured("todo:write")
  @CacheInvalidate("todos")
  @Post
  public MutableHttpResponse<Map<String, Object>> createTodo(@Valid @Body TodoRequest request)
      throws ApplicationException {
    OffsetDateTime startTime = OffsetDateTime.now();
    String requestId = "TODO-" + UuidUtil.timeBasedUuidString();

    if (logger.isDebugEnabled()) {
      logger.debug("Creating new todo: {} (Request ID: {})", request.title(), requestId);
    }
    if (logger.isTraceEnabled()) {
      logger.trace("Create todo details: {}", request);
    }
    Todo todo = todoMapper.toEntity(request);
    TodoResponse response = todoMapper.toResponse(todoService.create(todo));
    return HttpResponseUtil.create(
        HttpStatus.CREATED,
        requestId,
        RequestStatus.SUCCESS,
        "",
        "Todo created",
        startTime,
        Map.of("todo", response));
  }

  @Secured("todo:write")
  @CacheInvalidate("todos")
  @Put("/{id}")
  public MutableHttpResponse<Map<String, Object>> updateTodo(Integer id, @Valid @Body TodoRequest request)
      throws ApplicationException {
    OffsetDateTime startTime = OffsetDateTime.now();
    String requestId = "TODO-" + UuidUtil.timeBasedUuidString();

    if (logger.isDebugEnabled()) {
      logger.debug("Updating todo ID {} (Request ID: {})", id, requestId);
    }
    if (logger.isTraceEnabled()) {
      logger.trace("Update todo details: {}", request);
    }
    Todo todo = todoMapper.toEntity(request);
    Todo updated = todoService.update(id, todo);
    if (updated == null) {
      logger.warn("Update failed: Todo with ID {} not found (Request ID: {})", id, requestId);
      throw new ApplicationException("TODO_NOT_FOUND", "Todo with id " + id + " not found");
    }
    if (logger.isDebugEnabled()) {
      logger.debug("Todo ID {} updated successfully", id);
    }
    TodoResponse response = todoMapper.toResponse(updated);
    return HttpResponseUtil.create(
        HttpStatus.OK,
        requestId,
        RequestStatus.SUCCESS,
        "",
        "Todo updated",
        startTime,
        Map.of("todo", response));
  }

  @Secured("todo:write")
  @CacheInvalidate("todos")
  @Delete("/{id}")
  public MutableHttpResponse<Map<String, Object>> deleteTodo(Integer id) throws ApplicationException {
    OffsetDateTime startTime = OffsetDateTime.now();
    String requestId = "TODO-" + UuidUtil.timeBasedUuidString();

    if (logger.isDebugEnabled()) {
      logger.debug("Deleting todo ID {} (Request ID: {})", id, requestId);
    }
    todoService.delete(id);
    return HttpResponseUtil.create(
        HttpStatus.OK,
        requestId,
        RequestStatus.SUCCESS,
        "",
        "Todo deleted",
        startTime,
        Map.of());
  }

}
