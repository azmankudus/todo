---
name: vibe-todo-patterns
description: Core implementation patterns and known "gotchas" for the Vibe Todo application (SolidJS + Java Micronaut).
---

# Vibe Todo Implementation Patterns

This skill documentation ensures consistency and prevents hallucinations when modifying the Vibe Todo codebase.

## Backend Patterns (Java Micronaut)

### 1. Entity Definition
Use Java records for immutable entities:
```java
public record Todo(
    String id,
    String title,
    boolean completed,
    int priority,
    Instant createdAt,
    Instant completedAt
) {}
```

### 2. DuckDB Repository Pattern
DuckDB requires explicit `RETURNING` clauses:
```java
@Query("INSERT INTO todo (...) VALUES (...) RETURNING *")
Todo save(Todo todo);

@Query("UPDATE todo SET title=:title WHERE id=:id RETURNING *")
Todo update(String id, String title);
```

### 3. Data Initializers
Use `@Requires` to skip in tests:
```java
@Requires(property = "data-initialization.enabled", value = "true", defaultValue = "false")
@Singleton
public class TodoDataInitializer implements ApplicationEventListener<StartupEvent> { ... }
```

### 4. Controller with Caching
```java
@Controller("/api/todo")
@Cacheable("todos")
public class TodoController {
    @Get public List<Todo> list() { ... }
    @Post @CacheInvalidate("todos") public Todo create(@Body TodoCreateRequest req) { ... }
    @Put @CacheInvalidate("todos") public Todo update(String id, @Body TodoUpdateRequest req) { ... }
    @Delete @CacheInvalidate("todos") public void delete(String id) { ... }
}
```

### 5. Service Layer Pattern
- **Concrete Classes Only**: Use concrete concrete classes annotated with `@Singleton`. Avoid Interface/Impl pairs unless multiple implementations are actually required.
- **Constructor Injection**: Use standard constructor injection without the `@Inject` annotation (Micronaut handles this automatically for single constructors).

### 6. Modern Java Coding Standards
- **Explicit Typing**: DO NOT use `var`. Always use explicit types for local variable declarations to maintain clarity.
- **Functional Idioms**: Favor `Optional` and `Stream` APIs for cleaner, more declarative logic.
- **No Boilerplate**: Use Java records for all DTOs and Entities.
- **MapStruct for Mappers**: Use MapStruct interfaces with `componentModel = MappingConstants.ComponentModel.JAKARTA` for all data mapping. Avoid manual mapper implementations.
- **Exception Propagation**: Allow `SQLException` and other core exceptions to propagate to the `Controller` layer. Wrap them in `ApplicationException` with the original cause to preserve stack traces for the frontend "More Info" button.

## Frontend Patterns (SolidJS)

### 1. Global State Management
- **Layout State**: Use `src/shared/stores/layoutStore.ts` for global UI toggles (`isWideMode`)
- **Loading State**: Use `src/shared/stores/loadingStore.ts` via `showLoading(id, msg)` and `hideLoading()`
- **LocalStorage**: All keys must use `getStorageKey()` from `src/config.ts`

```typescript
// CORRECT
localStorage.setItem(getStorageKey('theme'), theme);

// WRONG
localStorage.setItem('theme', theme);
```

- **Authentication State**: To avoid circular dependencies with `apiClient`, extract core auth state (`user`, `accessToken`, `refreshToken`) and headers (`getAuthHeaders`) into `src/shared/stores/authBase.ts`. `src/shared/stores/authStore.ts` should import from `authBase.ts` and handle high-level logic (login/logout).

### 2. Component Design
- **Theme Selection**: Use custom `ThemeDropdown` in Navigation.tsx (not native `<select>`)
- **Tooltips**: Use Portal-based Tooltip component with `getBoundingClientRect()` for fixed positioning
- **Scrollbars**: Apply `.custom-scrollbar` class for styled scrollbars

### 3. Animations & Transitions
**CRITICAL - List Animations:**
```tsx
// CORRECT - Use TransitionGroup for lists
<TransitionGroup enterClass="opacity-0" exitClass="opacity-0">
  <For each={todos()}>{(todo, i) => 
    <li data-index={i()} class="transition-opacity duration-200">{todo.title}</li>
  }</For>
</TransitionGroup>

// WRONG - Presence fails with >10 items
<Presence><For each={todos()}>...</For></Presence>
```

For staggered animations, use `data-index` attribute and retrieve in `onEnter`:
```typescript
onEnter={(el, done) => {
  const index = parseInt(el.getAttribute('data-index') || '0');
  // Use index for stagger delay
}}
```

### 4. Styling (TailwindCSS 4)
- Use `@theme` and `@apply` in `app.css`
- All interactive elements have `cursor: pointer` globally
- Use `cursor-help` for tooltip triggers

### 5. Component Props Pattern
```tsx
interface Props {
  title: string;
  onClick?: () => void;
  class?: string;
  children?: JSX.Element;
}

export function MyComponent(props: Props) {
  const { title, onClick, class: klass, children } = props;
  return (
    <button class={klass} onClick={onClick}>
      {title}
      {children}
    </button>
  );
}
```

## API Integration

### SqlController Response
```typescript
interface SqlResult {
  rows: Record<string, unknown>[];
  columns: string[];
  columnTypes: Map<string, string>;  // e.g., "VARCHAR", "TIMESTAMP"
}
```

Frontend uses `columnTypes` to format cells (e.g., TimestampTooltip for timestamps).

### 2. Centralized `apiClient`
**ALWAYS** use the centralized `apiClient` from `src/shared/utils/api.ts` for all network requests.

```typescript
// Standard usage
const data = await apiClient("/todo", {
  method: "POST",
  body: JSON.stringify(payload)
});

if (data.status === ApiStatus.SUCCESS) {
  // Use data.details
}
```

It automatically handles:
- Base URL (`VITE_API_URL`)
- Authorization headers from `src/shared/stores/authBase.ts`
- Standardized JSON parsing with fallbacks
- `ApiResponse` structure validation

### 3. Data Modals & Details
Use `DataModal.tsx` for displaying detailed record information.
- **Standard Columns**: Pass a list of keys to display.
- **Custom Footer**: Use the `footer` prop for action buttons (e.g., Delete, Complete).
- **Nested Data**: If the API response is nested (like error details), use a flattening utility before passing `data` to the modal to ensure all fields are visible.

### 4. Interactive Shortcuts
- **SQL Explorer**: Support `Ctrl+Enter` for immediate query execution. Inform users with a label near the textarea.

### 5. Navigation Refresh
- Support re-navigating to the current page by clicking the active menu item.
- Implementation: `Navigation.tsx` calls `onRefreshRoute` (via `App.tsx` state) to increment a `routeKey`, forcing a component re-mount.

## Known Non-Blocking Warnings

| Warning | Cause | Action |
|---------|-------|--------|
| CSS `@theme` warnings in IDE | Old CSS parser | Ignore, verify build instead |
| `RepoTest.log` unused | Left for debugging | Ignore |

## File Locations Quick Reference

| Main entry | `backend/src/main/java/com/example/todo/Main.java` |
| Modules | `backend/src/main/java/com/example/todo/modules/[module]/` |
| Shared (BE) | `backend/src/main/java/com/example/todo/shared/` |
| Migrations | `backend/src/main/resources/db/migration/V*.sql` |
| Frontend routes | `frontend/src/routes/*.tsx` |
| Modules (FE) | `frontend/src/modules/[module]/` |
| UI components | `frontend/src/shared/components/ui/*.tsx` |
| Animations | `frontend/src/shared/components/animations/*.tsx` |
| Stores | `frontend/src/shared/stores/*.ts` |
| Themes | `frontend/src/styles/themes/*.css` |

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `routes/index.tsx` | Home page |
| `/todo` | `routes/todo.tsx` | Todo management |
| `/sql` | `routes/sql.tsx` | SQL explorer |
| `/errors` | `routes/errors.tsx` | Error demo |
| `/500` | `routes/500.tsx` | Server error |
| `...404` | `routes/[...404].tsx` | Catch-all 404 |

## Formatting Standards

**ALWAYS** adhere to these formatting rules for both frontend and backend code:
- **Indent Size**: 2 spaces
- **Wrap Size**: 120 characters
- **Import Management**:
  - Remove all unused imports.
  - Reorganize and sort imports (Alphabetical order, grouped by package: standard, third-party, project-specific).
