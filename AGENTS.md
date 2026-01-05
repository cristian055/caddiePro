# AGENTS.md

## Build Commands

- `npm run dev` - Start Vite development server at http://localhost:5173
- `npm run build` - TypeScript type check and Vite production build
- `npm run lint` - Run ESLint with auto-fix
- `npm run test` - Run all tests (Vitest)
- `npm run test:ui` - Run Vitest with browser UI
- `npm run test -- src/components/ui/Button.test.tsx` - Run single test file
- `npm run test -- -t "should render"` - Run tests matching pattern
- `npm run test:coverage` - Run tests with coverage report

## TypeScript Configuration

- **Strict mode**: Enabled
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **Unused locals/parameters**: Not allowed
- **verbatimModuleSyntax**: Enabled (use `import type` for types)

## Code Style Guidelines

### Imports
- Group order: React/external libs → hooks → types → utils → config → components
- Type-only imports: `import type { Caddie } from '../types'`
- Hooks: `import { useCaddies, useAuth } from '../hooks'`
- Schemas: `import { createCaddieSchema } from '../utils/validation'`
- Config: `import { API, BREAKPOINTS } from '../config'`

### Component Structure
- Use `React.FC<T>` with explicit type parameter for components
- Prefer named exports (except App.tsx uses default)
- Component file MUST have corresponding `.css` file
- Style and logic in separate files - no inline styles
- Props interface co-located with component

### Naming Conventions
- Components: PascalCase (e.g., `AttendanceCall`, `CaddieManagement`)
- Functions/variables: camelCase (e.g., `handleSave`, `isLoading`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `TOKEN_KEY`)
- Types/Interfaces: PascalCase (e.g., `Caddie`, `Turn`, `AttendanceRecord`)
- Query Keys: `caddiesQueryKeys` (lowercase + QueryKeys suffix)
- CSS classes: BEM-like (e.g., `attendance-call`, `btn--primary`, `card--elevated`)

### Type Definitions
- Use `interface` for object shapes that can be extended
- Use `type` for unions, literals, primitives
- Define shared types in `src/types/index.ts`
- DTOs in `src/utils/validation.ts` (Zod schemas)
- Union types for string literals: `'Disponible' | 'En campo' | 'Ausente'`

## State Management

- **Primary**: React Query (TanStack Query) for server state
- **Secondary**: React Context for app-wide state (`AppContext`, `ToastProvider`)
- Use React Query hooks: `useCaddies()`, `useTurns()`, `useAttendance()`, `useAuth()`
- Query keys: Hierarchical with factory functions:
  ```typescript
  export const caddiesQueryKeys = {
    all: ['caddies'] as const,
    lists: () => [...caddiesQueryKeys.all, 'list'] as const,
    detail: (id: string) => [...caddiesQueryKeys.all, 'detail', id] as const,
  };
  ```
- Local state with `useState` for component-specific UI state
- Toast notifications via `useToast()` hook

## Error Handling

- Use `ErrorBoundary` at app level for catching React errors
- Early returns: `if (!caddie) return null;`
- Try/catch blocks for API calls with `ApiError` class
- Set error state via `setError(message)` on failures
- Show toast notifications: `showToast('Error message', 'error')`
- Fallback components: `FallbackError`, `FallbackLoading`, `EmptyState`, `Skeleton*`
- 401 errors trigger automatic logout via QueryClient onError callback

## API Client

- Backend service in `src/services/api.ts` with `ApiClient` singleton class
- API modules: `authApi`, `caddiesApi`, `turnsApi`, `attendanceApi`, `reportsApi`, `messagesApi`
- Base URL: `import.meta.env.VITE_API_BASE_URL` (defaults to localhost:3000)
- Token stored in `caddiePro_token` localStorage key
- All requests logged to console (prefixed with `[API]`)
- Protected endpoints: `Authorization: Bearer <token>` header
- Custom `ApiError` class with `status` and `data` properties

## Styling

- Plain CSS with separate `.css` files per component
- CSS variables from `src/styles/tokens.css`
- BEM-like naming: `attendance-call`, `btn-primary`, `card--elevated`
- Mobile-first responsive with `@media (min-width: ...)` breakpoints
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Use CSS custom properties for colors, spacing, typography

## Routing

- React Router v7 with `BrowserRouter`, `Routes`, `Route`
- Layout routes with `RootLayout` wrapping child routes
- `useNavigate()` hook for programmatic navigation
- `useLocation()` hook for current path detection
- All routes defined in `App.tsx` with `/dashboard`, `/caddies`, `/attendance`, `/messaging`, `/reports` using Dashboard component
- **IMPORTANT**: `vercel.json` at root enables SPA routing - all routes rewrite to `index.html`

## UI Components

Reusable components in `src/components/ui/`:
- `Button` - variants: `primary`, `default`, `ghost`
- `Card`, `Container`, `Modal`, `Icon`
- `Skeleton` - variants: `SkeletonText`, `SkeletonCircle`, `SkeletonCard`, `SkeletonTable`
- `Fallbacks` - `FallbackError`, `FallbackLoading`, `EmptyState`
- `ToastProvider` - wraps app for toast notifications

## Localization & Text

- UI text and comments in Spanish
- Admin password: `admin123`
- User-facing messages in Spanish
- Date/time in ISO format for storage, localized for display

## Form Validation

- Use Zod schemas from `src/utils/validation.ts`
- Helper: `validateForm(schema, data)` returns `{ valid: boolean; errors: Record<string, string> }`
- Type-safe form data types inferred from schemas
- Display errors with `form-error` CSS class

## File Organization

```
src/
├── components/    # React components (features and ui)
│   └── ui/        # Reusable UI components
├── pages/         # Route components (Dashboard, Login, TurnsPage, RootLayout)
├── hooks/         # Custom React hooks (useAuth, useCaddies, useTurns, etc.)
├── services/      # API client and API modules (api.ts)
├── context/       # React Context (AppContext)
├── config/        # Config & constants
├── types/         # TypeScript types (index.ts exports all)
├── utils/         # Utilities (validation.ts, logger.ts)
├── styles/        # Global styles, tokens.css
└── providers/     # React providers (QueryProvider, ToastProvider)
```

## Key Type Notes

- `Caddie.listNumber` (not `listNumber`) - numeric field (1, 2, or 3)
- `Turn.endTime: string | null` - nullable for active/in-progress turns
- `AttendanceRecord.arrivalTime: string | null` - nullable until arrival
- `ListSettings.createdAt`, `ListSettings.updatedAt` - backend timestamps
- `ApiError` - Custom error class with `status` and `data` properties
- `ToastType` - 'success' | 'error' | 'warning' | 'info'
- `CaddieStatus` - 'Disponible' | 'En campo' | 'Ausente'
- `AttendanceStatus` - 'Presente' | 'Llegó tarde' | 'No vino' | 'Permiso'

## Idioms & Patterns

- Immutable state: `...prev` spread pattern
- Async handlers: `onClick={async () => await mutate.mutate(data)}`
- Loading states: `query.isLoading` or `mutation.isLoading`
- Status classes: `status-${status.replace(/\s+/g, '-').toLowerCase()}`
- Auto-refresh: `useEffect` with `setInterval` and cleanup function
- UUID IDs from backend (no timestamp-based generation)
- Date handling: `new Date().toISOString()` for storage
