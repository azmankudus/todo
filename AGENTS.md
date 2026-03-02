# AGENTS.md - Agent Guidelines

## Project Summary

**TodoVibe** - Full-stack task management app with SQL explorer.

| Component | Technology |
|-----------|------------|
| Backend | Micronaut 4.x + Java 21 + H2 (Postgres Mode) |
| Frontend | SolidJS + SolidStart + TailwindCSS 4 |
| Build | Gradle (backend) + Bun (frontend) |
| Context Path | `/todo` |

## Quick Commands

```bash
# Backend
cd backend && ./gradlew build          # Full build (includes frontend)
cd backend && ./gradlew test           # Run tests
cd backend && ./gradlew run            # Start server (port 8080)

# Frontend (MUST use bun)
cd frontend && bun install             # Install deps
cd frontend && bun run dev             # Dev server
cd frontend && bun run build           # Production build
cd frontend && bun run test            # Run Vitest
```

## When to Use Task Tool vs Bash

### Use Task Tool For:
- Complex multi-step tasks requiring exploration
- Codebase-wide analysis or refactoring
- Parallel agent coordination

### Use Bash For:
- Single direct commands (build, test, run)
- File operations
- Quick checks

## Critical Constraints

1. **Micronaut versions**: NEVER specify in libs.versions.toml - plugin manages them
2. **Frontend commands**: ALWAYS use `bun run` - never npm/yarn
3. **H2 Database**: Supports `RETURNING` clauses (Postgres mode); use `tb_` prefix for tables.
4. **Animations**: Use `TransitionGroup`, not `Presence` for lists >10 items
5. **LocalStorage**: Use `getStorageKey()` for all keys

## Key Files

| File | Purpose |
|------|---------|
| `backend/build.gradle.kts` | Build config (triggers frontend build) |
| `backend/gradle/libs.versions.toml` | Version catalog |
| `backend/src/main/resources/application.properties` | Backend config |
| `frontend/src/app.tsx` | Root component |
| `frontend/src/config.ts` | Frontend config |
| `CONTEXT.md` | Architecture details |
| `REQUIREMENTS.md` | Constraints & requirements |
| `PROMPTS.md` | Common workflows |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/todo/api/todo` | List/Create todos |
| PUT/DELETE | `/todo/api/todo/{id}` | Update/Delete todo |
| POST | `/todo/api/sql` | Execute SQL query |
| GET | `/todo/ui/**` | SPA routes |

## Documentation Files

- `CONTEXT.md` - Architecture & directory structure
- `REQUIREMENTS.md` - Constraints & build requirements
- `PROMPTS.md` - Common workflows & debugging
- `SKILL.md` - Critical patterns to prevent errors
- `.agent/skills/vibe-todo-patterns/SKILL.md` - Detailed implementation patterns
