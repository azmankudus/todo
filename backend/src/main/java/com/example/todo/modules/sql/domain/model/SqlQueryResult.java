package com.example.todo.modules.sql.domain.model;

import java.util.List;
import java.util.Map;

public record SqlQueryResult(
        boolean success,
        String errorMessage,
        List<Map<String, Object>> rows,
        List<String> columns,
        Map<String, String> columnTypes,
        long totalRows) {
}
