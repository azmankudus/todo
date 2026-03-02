package com.example.todo.modules.sql.web.dto;

import io.micronaut.serde.annotation.Serdeable;
import java.util.List;
import java.util.Map;

@Serdeable
public record SqlResult(
        boolean success,
        String errorMessage,
        List<Map<String, Object>> rows,
        List<String> columns,
        Map<String, String> columnTypes,
        long totalRows,
        int page,
        int size) {
}
