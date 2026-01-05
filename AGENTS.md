# AGENTS.md

## Build Commands

- `npm run dev` - Start Vite development server at http://localhost:5173
- `npm run build` - TypeScript type check and Vite production build
- `npm run lint` - Run ESLint with auto-fix
- `npm run preview` - Preview production build locally

## TypeScript Configuration

- **Strict mode**: Enabled
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **Unused locals/parameters**: Not allowed
- **verbatimModuleSyntax**: Enabled (use `import type` for types)
- **JSX**: React JSX transform
- **Project references**: Separate configs for app and node environments

## ESLint Configuration

- **Config**: Flat config format (`eslint.config.js`)
- **Rules**: TypeScript recommended + React hooks + React refresh
- **Ignores**: `dist/` directory
- **Plugins**: `typescript-eslint`, `react-hooks`, `react-refresh`

## Vite Configuration

- **Plugin**: React plugin for JSX transformation
- **Build output**: `dist/` directory
- **Development server**: Hot module replacement enabled

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
- Use `interface` for object shapes that can be extended (e.g., API responses, component props)
- Use `type` for unions, literals, primitives, and component prop types
- Define shared types in `src/types/index.ts`
- DTOs in `src/utils/validation.ts` (Zod schemas)
- Union types for string literals: `'Disponible' | 'En campo' | 'Ausente'`
- WebSocket event types defined in `src/services/websocket.ts`

## State Management

- **Primary**: React Query (TanStack Query) for server state
- **Secondary**: React Context for app-wide state (`AppContext`, `ToastProvider`)
- **WebSocket**: Real-time updates via `wsService` singleton
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
- WebSocket updates trigger local state changes via `useCaddieUpdates` hook

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

## WebSocket Integration

- WebSocket service in `src/services/websocket.ts` with `wsService` singleton class
- Base URL: `import.meta.env.VITE_WS_URL` (defaults to localhost:3000)
- Events: `caddie:status_changed`, `caddie:added`, `caddie:updated`, `caddie:deleted`
- Hook `useCaddieUpdates` for real-time updates with automatic cleanup
- Connection status monitoring via `onConnectionChange` callback
- Auto-reconnection with configurable attempts and delay

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

## Localization & Validation

- UI text and comments in Spanish
- Admin password: `admin123`
- Date/time in ISO format for storage, localized for display
- Form validation with Zod schemas from `src/utils/validation.ts`
- Helper: `validateForm(schema, data)` returns `{ valid: boolean; errors: Record<string, string> }`
- Display errors with `form-error` CSS class

## File Organization

```
src/
├── assets/        # Static assets (images, icons)
├── components/    # React components (features and ui)
│   └── ui/        # Reusable UI components
├── pages/         # Route components (Dashboard, Login, TurnsPage, RootLayout)
├── hooks/         # Custom React hooks (useAuth, useCaddies, useTurns, etc.)
├── services/      # API client and API modules (api.ts, websocket.ts)
├── context/       # React Context (AppContext)
├── config/        # Configuration & constants
├── types/         # TypeScript types (index.ts exports all)
├── utils/         # Utilities (validation.ts with Zod schemas)
├── styles/        # Global styles, CSS variables (tokens.css)
├── providers/     # React providers (QueryProvider, ToastProvider)
└── main.tsx       # App entry point
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
- `ListOrder` - 'ascendente' | 'descendente'
- `ListNumber` - 1 | 2 | 3
- `WebSocketEvent` - Union type for WebSocket event names

## Idioms & Patterns

- Immutable state: `...prev` spread pattern
- Async handlers: `onClick={async () => await mutate.mutate(data)}`
- Loading states: `query.isLoading` or `mutation.isLoading`
- Status classes: `status-${status.replace(/\s+/g, '-').toLowerCase()}`
- UUID IDs from backend (no timestamp-based generation)
- Date handling: `new Date().toISOString()` for storage
- WebSocket event handling: Use `useCaddieUpdates` hook with object options
- WebSocket cleanup: Automatic cleanup via returned functions from `on*` methods
