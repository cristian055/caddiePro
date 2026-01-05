# AGENTS.md

## Build Commands

- `npm run dev` - Start Vite development server
- `npm run build` - TypeScript type check and Vite production build
- `npm run lint` - Run ESLint
- `npm run test` - Run all tests (Vitest)
- `npm run test:ui` - Run Vitest with UI
- `npm run test -- src/components/ui/Button.test.tsx` - Run single test file
- `npm run test -- -t "should render"` - Run tests matching pattern
- `npm run test:coverage` - Run tests with coverage report

## TypeScript Configuration

- **Strict mode**: Enabled
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **Unused locals/parameters**: Not allowed
- **verbatimModuleSyntax**: Enabled

## Code Style Guidelines

### Imports
- Group order: React/external libs → hooks → types → utils → config → components
- Type-only imports: `import type { Caddie } from '../types'`
- Hooks: `import { useCaddies, useAuth } from '../hooks'`
- Schemas: `import { createCaddieSchema } from '../utils/validation'`
- Config: `import { API, BREAKPOINTS } from '../config'`

### Component Structure
- Use `React.FC<T>` with explicit type parameter
- Prefer named exports over default exports
- Component file MUST have corresponding `.css` file
- Style and logic in separate files - no inline styles

### Naming Conventions
- Components: PascalCase (e.g., `AttendanceCall`, `CaddieManagement`)
- Functions/variables: camelCase (e.g., `handleSave`, `isLoading`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `TOKEN_KEY`)
- Types/Interfaces: PascalCase (e.g., `Caddie`, `Turn`, `AttendanceRecord`)
- Query Keys: `caddiesQueryKeys` (lowercase + QueryKeys suffix)
- CSS classes: BEM-like (e.g., `navigation__user-dropdown`, `toast--success`)

### Type Definitions
- Use `interface` for object shapes that can be extended
- Use `type` for unions, literals, primitives
- Define types in `src/types/index.ts` for shared types
- DTOs in `src/utils/validation.ts` (Zod schemas)
- Union types for string literals: `'Disponible' | 'En campo' | 'Ausente'`

### State Management
- Primary: React Query (TanStack Query) for server state
- Secondary: React Context for app-wide state (`AppContext`, `ToastProvider`)
- Use React Query hooks: `useCaddies()`, `useTurns()`, `useAttendance()`, `useAuth()`
- Query keys: Hierarchical (e.g., `caddiesQueryKeys.all`, `caddiesQueryKeys.detail(id)`)
- Local state with `useState` for component-specific UI state
- Toast notifications via `useToast()` hook

### Error Handling
- Use `ErrorBoundary` at app level for catching errors
- Early returns: `if (!caddie) return;`
- Try/catch blocks for API calls
- Set error state via `setError(message)` on failures
- Show toast notifications: `showToast('Error message', 'error')`
- Fallbacks: `FallbackError`, `FallbackLoading`, `EmptyState`, `Skeleton*`
- 401 errors trigger automatic logout via QueryClient

### API Client
- Backend service in `src/services/api.ts` with ApiClient class
- React Query hooks wrap API calls
- Base URL: `import.meta.env.VITE_API_BASE_URL`
- Token in `caddiePro_token` localStorage key
- All requests logged to console (prefixed with `[API]`)
- Protected endpoints: `Authorization: Bearer <token>` header

### Styling
- Plain CSS with separate `.css` files per component
- CSS variables from `src/styles/tokens.css`
- BEM-like naming: `attendance-call`, `btn-primary`, `card--elevated`
- Mobile-first responsive with `@media (min-width: ...)` breakpoints
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Use CSS custom properties for colors, spacing, typography

### Routing
- React Router with `BrowserRouter`, `Routes`, `Route`
- `useNavigate()` hook for navigation
- `useLocation()` hook for current path detection
- Navigation component at top level for all routes

### Toast Notifications
- Use `useToast()` hook from `ToastProvider`
- Show toasts: `showToast(message, type)` where type is `'success' | 'error' | 'warning' | 'info'`
- Auto-dismiss after 4 seconds
- Position: bottom-right on desktop, bottom-full-width on mobile

### Icon Components
- Use `Icon` from `src/components/ui/Icon.tsx`
- Props: `{ name, className?, size? }`
- Available icons: golf, list, people, phone, message, chart, lock, settings, arrow-left, clipboard, check, x, arrow-back

### UI Components
- Reusable in `src/components/ui/`: Button, Card, Container, Modal, Skeleton, Fallbacks, ToastProvider
- Button variants: `primary`, `default`, `ghost`
- Skeleton variants: `SkeletonText`, `SkeletonCircle`, `SkeletonCard`, `SkeletonTable`, `SkeletonBlock`
- Button: `variant?: 'primary' | 'default' | 'ghost'`

### Localization
- UI text and comments in Spanish
- Admin password: `admin123`
- User-facing messages in Spanish

### Form Validation
- Use Zod schemas from `src/utils/validation.ts`
- Helper: `validateForm(schema, data)` returns `{ valid: boolean; errors: Record<string, string> }`
- Type-safe form data types inferred from schemas
- Display errors with `form-error` CSS class

### Component Patterns
- Async event handlers: `onClick={async () => await mutate.mutate(data)}`
- Show loading state: `mutation.isLoading`
- Display errors: `mutation.error`
- Optimistic updates when appropriate
- Loading skeletons while data fetches

### Idioms
- Immutable state: `...prev` spread pattern
- Date: `new Date().toISOString()` for storage
- UUID IDs from backend (no timestamp-based)
- Auto-refresh: `useEffect` with `setInterval` and cleanup
- Status classes: `status-${status.replace(/\s+/g, '-').toLowerCase()}`

### File Organization
```
src/
├── components/    # React components
│   └── ui/        # Reusable UI components (Button, Card, Icon, Modal, Skeleton, Toast)
├── hooks/         # Custom React hooks (useAuth, useCaddies, useTurns, etc.)
├── services/      # API client (api.ts)
├── context/       # React Context (AppContext)
├── config/        # Config & constants
├── types/         # TypeScript types
├── utils/         # Utilities (validation.ts, logger.ts)
├── styles/        # Global styles, tokens.css
├── pages/         # Route components (Dashboard, Login, TurnsPage)
└── providers/     # React providers (QueryProvider, ToastProvider)
```

### Logging
- Use logger from `src/utils/logger.ts`
- Levels: debug, info, warn, error, none (via `VITE_LOG_LEVEL`)
- Module-scoped: `createLogger('ModuleName')`
- Performance: `performanceLog(label, duration)`

### Key Type Notes
- `Caddie.listNumber` (not `list`) - matches backend field names
- `Turn.endTime: string | null` - nullable for active turns
- `AttendanceRecord.arrivalTime: string | null` - nullable
- `ListSettings.createdAt`, `ListSettings.updatedAt` - backend timestamps
- `ApiError` - Custom error class with `status` and `data` properties
- `ToastType` - 'success' | 'error' | 'warning' | 'info'
