---
name: vibe-todo-patterns
description: Core implementation patterns and known "gotchas" for the Vibe Todo application (SolidJS + Java Micronaut).
---

# Vibe Todo Implementation Patterns

This skill documentation ensures consistency and prevents hallucinations when modifying the Vibe Todo codebase, particularly the balance between SolidJS frontend behaviors and the Java/DuckDB backend.

## Frontend Architecture (SolidJS)

### 1. Global State Management
- **Layout State**: Use the `layoutStore.ts` for global UI toggles like `isWideMode`. This is a Solid Signal exported directly and is persisted to `localStorage`.
- **LocalStorage Consistency**: All keys stored in `localStorage` must be wrapped in the `getStorageKey()` utility from `config.ts`. This ensures they are prefixed with `CONFIG.storagePrefix` (default: `vibe_todo_`) to avoid collisions.
- **Loading State**: Use `loadingStore.ts` via `showLoading(id, msg)` and `hideLoading()` to orchestrate the global progress modal.

### 2. Component Design
- **Theme Selection**: Do not use native `<select>` tags. Use the custom `ThemeDropdown` component in `Navigation.tsx`.
    - It handles sorting (placing the active value at the top).
    - It uses `OptionBadge` for visual color/pattern previews.
- **Tooltips**: Use the `Tooltip` component defined in `sql.tsx` (or extract to a shared UI folder).
    - **Implementation**: Uses `<Portal>` and `createEffect` with `getBoundingClientRect()` for `fixed` viewport positioning.
    - **Reason**: This prevents tooltips from being clipped by `overflow: hidden` or `overflow: auto` containers (like the SQL results table).
- **Scrollbars**: Apply the `.custom-scrollbar` class (defined in `app.css`) to containers with overflow.

### 3. Animations & Transitions
- **List Animations**: 
    - **NEVER** use `<Presence>` from `solid-motionone` for large arrays (e.g., more than 10 items) or items loaded behind a conditional `Show`. It often fails to track DOM nodes, rendering only the first item.
    - **ALWAYS** use `<TransitionGroup>` from `solid-transition-group`.
    - **Staggering**: Since standard `TransitionGroup` index arguments can be unstable on mount, use the `data-index={i()}` pattern on the `li` and retrieve it in `onEnter` via `el.getAttribute('data-index')`.
- **Mount Requirements**: Keep the `TransitionGroup` mounted even when data is empty to ensure `onEnter` triggers immediately when the `todos` array is populated from the backend.

### 4. Styling (Tailwind V4)
- The project follows Tailwind V4 conventions using `@theme` and `@apply` in `app.css`.
- **Cursor Pointer**: All interactive elements (`button`, `a`, etc.) are globally set to `cursor: pointer` in `app.css`. Use the `cursor-help` class for elements triggering tooltips.

## Backend Integration (Java Micronaut)

### 1. SQL Explorer Protocol
- The `SqlController.java` returns a `SqlResult` containing:
    - `rows`: Data list.
    - `columns`: Column names list.
    - `columnTypes`: A Map of column names to their SQL type names (e.g., `VARCHAR`, `TIMESTAMP`).
- The frontend uses `columnTypes` to determine formatting (e.g., rendering `renderCell` with `TimestampTooltip`).

### 2. DuckDB / Database
- Data types like UUID and TIMESTAMP are handled via JDBC.
- Ensure the backend continues to provide `columnTypeName` in metadata so the frontend can correctly identify formatting rules.

## Known Lints & Non-Blocking Warnings
- **CSS**: IDE warnings about `@theme` or `@variant` in `app.css` are typically false positives from older CSS module parsers; verify build status instead of chasing these.
- **Java**: `RepoTest.log` is unused but left for debugging context.

## Navigation & Routing
- Root: `/` (Home)
- Todo: `/todo`
- SQL Explorer: `/sql`
- User Profile: `/user/profile`
- Session Management: `/user/session`
