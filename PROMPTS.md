# PROMPTS.md - Common Prompts & Workflows

## Quick Reference Prompts

### Adding a New API Endpoint
```
Add a new REST endpoint in the backend:
1. Create or modify controller in backend/src/main/java/com/example/todo/modules/[module]/web/
2. Follow existing controller patterns (TodoController.java)
3. Add appropriate annotations (@Get, @Post, @Put, @Delete)
4. Update tests in backend/src/test/java/com/example/todo/modules/
5. Run: cd backend && ./gradlew test
```

### Adding a New Frontend Route
```
Add a new page to the frontend:
1. Create file in frontend/src/routes/ (e.g., newpage.tsx)
2. Follow existing route patterns (todo.tsx, sql.tsx)
3. Add navigation link in Navigation.tsx if needed
4. Run: cd frontend && bun run dev
```

### Adding a New UI Component
```
Create a new reusable UI component:
1. Create file in frontend/src/shared/components/ui/
2. Follow existing component patterns (TextButton.tsx, TextField.tsx)
3. Use prop splitting: const { prop1, prop2, ...rest } = props
4. Apply TailwindCSS classes
5. Export from index if needed
```

### Database Migration
```
Add a new database migration:
1. Create file in backend/src/main/resources/db/migration/
2. Name format: V{number}__description.sql (e.g., V3__add_tags.sql)
3. Write SQL DDL statements
4. Restart backend to apply
```

### Adding a New Theme
```
Add a new color theme:
1. Create CSS file in frontend/src/styles/themes/newtheme.css
2. Define CSS variables: --color-primary-*, --color-secondary-*
3. Import in frontend/src/app.css
4. Add to THEME_OPTIONS in Navigation.tsx
```

## Debugging Workflows

### Backend Not Starting
```bash
cd backend && ./gradlew clean build
# Check logs for port conflicts
# Verify application.properties
```

### Frontend Build Fails
```bash
cd frontend && rm -rf node_modules && bun install && bun run build
```

### Database Issues
```bash
# H2 database file: ./todo.db
# To reset: rm todo.db* && restart backend
```

### Test Failures
```bash
# Backend
cd backend && ./gradlew test --info

# Frontend  
cd frontend && bun run test
```

## Feature Implementation Checklist

- [ ] Backend: Entity/Repository/Controller
- [ ] Backend: Unit tests
- [ ] Backend: Integration tests (if API endpoint)
- [ ] Frontend: Route component
- [ ] Frontend: UI components
- [ ] Frontend: Store updates (if state needed)
- [ ] Frontend: Tests
- [ ] Documentation: Update CONTEXT.md if architecture changes
- [ ] Build verification: ./gradlew build
