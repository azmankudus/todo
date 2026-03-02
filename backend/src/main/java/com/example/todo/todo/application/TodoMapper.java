package com.example.todo.todo.application;

import com.example.todo.todo.api.dto.TodoRequest;
import com.example.todo.todo.api.dto.TodoResponse;
import com.example.todo.todo.domain.model.Todo;

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
