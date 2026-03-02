package com.example.todo.modules.todo.application;

import com.example.todo.modules.todo.web.dto.TodoRequest;
import com.example.todo.modules.todo.web.dto.TodoResponse;
import com.example.todo.modules.todo.domain.model.Todo;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA)
public interface TodoMapper {

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "completedAt", ignore = true)
  Todo toEntity(TodoRequest request);

  TodoResponse toResponse(Todo entity);
}
