package com.example.todo.sql.application;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.example.todo.sql.api.dto.SqlResult;
import com.example.todo.sql.domain.model.SqlQueryResult;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA)
public interface SqlMapper {

  SqlResult toResponse(SqlQueryResult result, int page, int size);
}
