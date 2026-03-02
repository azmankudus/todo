package com.example.todo.modules.sql.application;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.example.todo.modules.sql.web.dto.SqlResult;
import com.example.todo.modules.sql.domain.model.SqlQueryResult;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA)
public interface SqlMapper {

  SqlResult toResponse(SqlQueryResult result, int page, int size);
}
