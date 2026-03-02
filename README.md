# Todo Vibe

A full-stack task management application with SQL explorer.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Micronaut 4.x + Java 21 + DuckDB |
| Frontend | SolidJS + SolidStart + TailwindCSS 4 |
| Build | Gradle + Bun |

## Quick Start

```bash
# Backend
cd backend && ./gradlew build && ./gradlew run

# Frontend (separate terminal)
cd frontend && bun install && bun run dev
```

Server runs at `http://localhost:8080/todo/ui`

## Core Features
1. **Task Management**: A robust todo application with status management, priority levels, and detailed task inspection via modals.
2. **SQL Explorer**: Direct database access with query result tables, data detail modals, and high-performance result rendering.
3. **Advanced Error Handling**: Centralized API client (`apiClient`) with standardized `ApiResponse` structure, providing detailed error reporting and full stack traces for diagnostics.
4. **Modern UI**: Built with SolidJS, offering fluid animations, theme support (Dark/Light), and a responsive layout using TailwindCSS 4.
5. **Security**: Robust authentication using JWT tokens and secure-by-default route protection.

## Documentation

- [AGENTS.md](AGENTS.md) - Agent guidelines and quick commands
- [CONTEXT.md](CONTEXT.md) - Architecture and directory structure
- [REQUIREMENTS.md](REQUIREMENTS.md) - Constraints and build requirements
- [PROMPTS.md](PROMPTS.md) - Common workflows and debugging
- [SKILL.md](SKILL.md) - Critical patterns to prevent errors