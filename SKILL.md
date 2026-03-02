# SKILL.md - Critical Patterns to Prevent Errors

## CRITICAL: Micronaut Versioning

**NEVER** specify versions for Micronaut libraries in `libs.versions.toml`. The plugin manages all versions.

```toml
# CORRECT
micronaut-security-jwt = { module = "io.micronaut.security:micronaut-security-jwt" }

# WRONG - will cause version conflicts
micronaut-security-jwt = { module = "io.micronaut.security:micronaut-security-jwt", version = "4.15.1" }
```

## CRITICAL: Frontend Commands

**ALWAYS** use `bun run` for frontend operations. Never use npm, yarn, or call vinxi directly.

```bash
# CORRECT
bun run build
bun run dev
bun run test

# WRONG
npm run build
vinxi build
yarn dev
```

## CRITICAL: H2 Repository Pattern (PostgreSQL Mode)

H2 in PostgreSQL mode supports `RETURNING *` for INSERT/UPDATE operations:

```java
@Query("INSERT INTO tb_todo (id, title, priority, created_at) VALUES (:id, :title, :priority, :createdAt) RETURNING *")
Todo save(Todo todo);
```
Note: Tables use `tb_` prefix.

## CRITICAL: Data Initializers in Tests

Use `@Requires` annotation to skip data initializers during tests:

```java
@Requires(property = "data-initialization.enabled", value = "true", defaultValue = "false")
@Singleton
public class TodoDataInitializer { ... }
```

## CRITICAL: Frontend Animations

**NEVER** use `<Presence>` for large arrays (>10 items). Use `<TransitionGroup>`:

```tsx
// CORRECT
<TransitionGroup enterClass="opacity-0" exitClass="opacity-0">
  <For each={todos()}>{(todo, i) => 
    <li data-index={i()} class="transition-opacity">{todo.title}</li>
  }</For>
</TransitionGroup>

// WRONG - fails with >10 items
<Presence><For each={todos()}>...</For></Presence>
```

## CRITICAL: LocalStorage Keys

Always use `getStorageKey()` wrapper:

```typescript
// CORRECT
localStorage.setItem(getStorageKey('theme'), theme);

// WRONG - missing prefix
localStorage.setItem('theme', theme);
```

## CRITICAL: API Interaction

**ALWAYS** use the centralized `apiClient` from `src/shared/utils/api.ts` for all network requests. **NEVER** use `fetch` directly.

The `apiClient` ensures:
- Automatic attachment of Bearer tokens from `src/shared/stores/authBase.ts`
- Standardized `ApiResponse` structure validation
- Global error handling and logging
- Response flattening for complex data (like error stacks)

All endpoints **MUST** return a JSON response matching the `ApiResponse` interface:
```typescript
{
  status: ApiStatus; // SUCCESS, ERROR, WARNING
  message: string;
  details: any;      // payload
  timestamp: string;
  requestId: string;
}
```

## Backend Patterns

### Entity Definition
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

### Controller Pattern
Located in `com.example.todo.modules.[module].web`.
```java
@Controller("/api/todo")
@Cacheable("todos")
public class TodoController {
    @Get
    public List<Todo> list() { ... }
    
    @Post
    @CacheInvalidate("todos")
    public Todo create(@Body TodoCreateRequest req) { ... }
}
```

## Frontend Patterns

### Component with Props
```tsx
interface Props {
  title: string;
  onClick?: () => void;
  class?: string;
}

export function MyComponent(props: Props) {
  const { title, onClick, class: klass } = props;
  return <button class={klass} onClick={onClick}>{title}</button>;
}

### Icon Usage
**ALWAYS** use `solid-icons`. Import from sub-packages:
```tsx
import { FaSolidCheck } from "solid-icons/fa";
```
```

### Store Pattern
```typescript
// loadingStore.ts
const [loading, setLoading] = createSignal<Map<string, string>>(new Map());

export function showLoading(id: string, message: string) {
  setLoading(prev => new Map(prev).set(id, message));
}

export function hideLoading(id: string) {
  setLoading(prev => { const m = new Map(prev); m.delete(id); return m; });
}

## Formatting Standards

**ALWAYS** adhere to these formatting rules for both frontend and backend code:
- **Indent Size**: 2 spaces
- **Wrap Size**: 120 characters
- **Import Management**:
  - Remove all unused imports.
  - Reorganize and sort imports (Alphabetical order, grouped by package: standard, third-party, project-specific).
```

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "could not resolve plugin artifact" | Version conflict | Remove version from libs.versions.toml |
| SQLFeatureNotSupportedException in tests | Data initializer runs in tests | Add @Requires annotation |
| Animation only shows first item | Using Presence with large array | Use TransitionGroup |
| localStorage collision | Missing prefix | Use getStorageKey() |
| Frontend build fails | Using npm instead of bun | Run: bun install && bun run build |
| h2.Driver not found | Missing H2 dependency | Add `runtimeOnly(libs.h2)` to build.gradle.kts |
