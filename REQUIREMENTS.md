# REQUIREMENTS.md - Project Requirements & Constraints

## Runtime Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| Java | 21+ | Required for backend |
| Bun | Latest | Required for frontend (NOT npm/yarn) |
| Gradle | 8.x | Wrapper included |

## Build Commands

### Backend
```bash
cd backend && ./gradlew build      # Full build (includes frontend)
cd backend && ./gradlew test       # Run tests
cd backend && ./gradlew run        # Start server (port 8080)
```

### Frontend
```bash
cd frontend && bun install         # Install dependencies
cd frontend && bun run dev         # Dev server
cd frontend && bun run build       # Production build
cd frontend && bun run test        # Run Vitest
```

## Critical Constraints

### 1. Micronaut Version Management
**NEVER** specify versions for Micronaut libraries in `libs.versions.toml`. The Gradle plugin manages all versions.

```toml
# CORRECT
micronaut-security-jwt = { module = "io.micronaut.security:micronaut-security-jwt" }

# WRONG
micronaut-security-jwt = { module = "io.micronaut.security:micronaut-security-jwt", version = "4.15.1" }
```

### 2. Frontend Package Manager
**ALWAYS** use `bun run` for frontend commands. Never use npm, yarn, or call vinxi directly.

### 3. DuckDB Limitations
- Requires explicit `RETURNING` clauses for INSERT/UPDATE
- Use `@Requires` annotation to skip data initializers in tests:
  ```java
  @Requires(property = "data-initialization.enabled", value = "true", defaultValue = "false")
  ```

### 4. Animation Components
- **NEVER** use `<Presence>` from solid-motionone for large arrays (>10 items)
- **ALWAYS** use `<TransitionGroup>` from solid-transition-group for list animations
- Use `data-index` attribute pattern for staggered animations

### 5. LocalStorage Keys
All localStorage keys must use `getStorageKey()` from `config.ts` to ensure proper prefixing.

### 6. API Interaction Standard
- **Centralized Client**: **NEVER** use `fetch` directly. **ALWAYS** use `apiClient` from `src/utils/api.ts`.
- **Response Structure**: All endpoints must return the `ApiResponse` format:
  ```typescript
  export interface ApiResponse {
    status: ApiStatus; // SUCCESS / ERROR / WARNING
    message: string;
    details: any;      // payload or error details
    timestamp: string;
    requestId: string;
  }
  ```
- **Error Diagnostics**: Backend must propagate `SQLException` or other source errors. Controllers should wrap these in `ApplicationException` to provide a full stack trace in the `details` for frontend "More Info" buttons.

## Code Style

### Backend (Java)
- Use records for entities: `public record Todo(...) {}`
- Use SLF4J for logging
- Global exception handling via `GlobalExceptionHandler`

### Frontend (TypeScript/SolidJS)
- File-based routing in `src/routes/`
- Signals for reactive state
- Component prop splitting pattern
- TailwindCSS 4 with `@theme` and `@apply`

## Testing

| Layer | Framework |
|-------|-----------|
| Backend | JUnit 5 + Micronaut Test |
| Frontend | Vitest + @solidjs/testing-library |

## Deployment

- Backend serves frontend from `/todo/ui/**`
- Frontend builds to `backend/src/main/resources/public/ui/`
- Single JAR deployment
- Context path: `/todo`
