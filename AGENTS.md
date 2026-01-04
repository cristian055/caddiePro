# AGENTS.md

## Build Commands

- `npm run dev` - Start Vite development server
- `npm run build` - TypeScript type check and Vite production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

No test framework is currently configured.

## TypeScript Configuration

- **Strict mode**: Enabled
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **Unused locals/parameters**: Not allowed (noUnusedLocals, noUnusedParameters)
- **verbatimModuleSyntax**: Enabled - Use explicit type imports (e.g., `import type { Foo }`)

## Code Style Guidelines

### Imports
- Group imports: React/external libs first, then relative imports
- Use explicit type imports for types only: `import type { Caddie, ListNumber } from '../types'`
- Use `.tsx` extension for React component imports

### Component Structure
- Use `React.FC<T>` for functional components with explicit type parameter
- Prefer named exports over default exports
- Component files MUST include a corresponding `.css` file with same name
- Style and logic MUST be in separate files - no inline styles or style objects
- Create custom hooks in `src/hooks/` for reusable logic (prefix with `use`)
- Use descriptive prop interfaces/types

```tsx
export const ComponentName: React.FC<PropsType> = ({ prop1, prop2 }) => {
  // implementation
};
```

### Naming Conventions
- **Components**: PascalCase (e.g., `AttendanceCall`, `CaddieManagement`)
- **Functions/variables**: camelCase (e.g., `handleSave`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `TOKEN_KEY`)
- **Types**: PascalCase (e.g., `AppContextType`, `ButtonProps`)
- **Interfaces**: PascalCase (e.g., `Caddie`, `Turn`, `AttendanceRecord`)

### Type Definitions
- Use `interface` for object shapes that can be extended
- Use `type` for unions, literals, and primitive types
- Define types in `src/types/index.ts` for shared types
- Use union types for string literals (e.g., `'Disponible' | 'En campo' | 'Ausente'`)
- Use `string | null` for optional fields that can be null from backend

### State Management
- Primary state via React Context (`src/context/AppContext.tsx`)
- Use `useApp()` custom hook to access context
- Always call `useApp()` within `AppProvider` wrapper (throws error otherwise)
- Local state with `useState` for component-specific UI state
- Context functions are async (return `Promise<void>`)
- Use `refreshData()` to fetch latest data from backend
- State includes `isLoading` and `error` for async operations

### Error Handling
- Use early returns for validation: `if (!caddie) return;`
- Wrap API calls in try/catch blocks
- Set error state via `setError(message)` on failures
- Display error messages to users from context `error` prop
- Backend errors logged to console via ApiClient

### API Client
- Backend service in `src/services/api.ts` with ApiClient class
- Base URL: `http://localhost:3000/api`
- JWT token stored in `caddiePro_token` localStorage key
- All API requests logged to browser console for debugging
- Protected endpoints require `Authorization: Bearer <token>` header
- Token management: `setToken(token)`, `getToken()`, cleared on logout

### Backend Integration
- Backend API specification in `BACKEND_API.md`
- All CRUD operations go through backend (no direct localStorage)
- JWT-based authentication for admin access
- Entities: Caddies, Turns, Attendance, ListSettings, Messages, Reports
- Health check: `GET /health` to verify backend connectivity
- Login endpoint: `POST /api/auth/login` with password field

### Styling
- Plain CSS with separate `.css` files per component
- Use CSS variables from `src/styles/tokens.css` for colors, spacing, typography
- BEM-like class naming (e.g., `attendance-call`, `btn-primary`)
- Use className props for additional styling
- Mobile-first responsive design with `@media (min-width: ...)` breakpoints
- Common breakpoints: 640px (sm), 768px (md), 1024px (lg)

### Routing
- React Router with `BrowserRouter`, `Routes`, `Route`
- Main routes in `src/App.tsx`
- `useNavigate()` hook for navigation
- `useLocation()` hook for current path detection

### Icon Components
- Use `Icon` component from `src/components/ui/Icon.tsx`
- Supports predefined icon names via `IconName` type
- Props: `{ name, className?, size? }`
- Available icons: golf, list, people, phone, message, chart, lock, settings, arrow-left, clipboard

### UI Components
- Reusable components in `src/components/ui/`
- Button component supports `variant?: 'primary' | 'default'`
- Extend native HTML element types for props: `React.ButtonHTMLAttributes<HTMLButtonElement>`
- Common button variants: btn-primary, btn-secondary, btn-success, btn-warning, btn-danger, btn-config

### Localization
- UI text and comments in Spanish (app is for Spanish-speaking users)
- Labels and messages in Spanish
- Admin password for backend: `admin123`

### Component Patterns
- Event handlers calling context functions must be async: `onClick={async () => await deleteCaddie(id)}`
- Show loading state during async operations when needed
- Display error messages from context when available
- Use `await` for all API calls in event handlers

### Idioms
- Use `...prev` spread for immutable state updates
- Filter and map with immutable patterns
- Date handling: `new Date().toISOString()` for storage, split for display
- IDs: Backend returns UUIDs (no longer timestamp-based)
- Auto-refresh intervals: use `useEffect` with `setInterval` and cleanup
- Class name manipulation for status: `status-${status.replace(/\s+/g, '-').toLowerCase()}`

### File Organization
- Components: `src/components/` - Feature components (AttendanceCall, CaddieManagement, etc.)
- Pages: `src/pages/` - Route-level components (Dashboard, Login, TurnsPage, RootLayout)
- UI: `src/components/ui/` - Reusable UI components (Button, Icon)
- Services: `src/services/` - API client and backend integration (api.ts)
- Context: `src/context/` - React Context providers (AppContext.tsx)
- Types: `src/types/index.ts` - Shared TypeScript types/interfaces
- Styles: `src/styles/` - Global styles and design tokens (tokens.css)

### Key Type Notes
- `Caddie.listNumber` (not `list`) - matches backend field names
- `Turn.endTime: string | null` - nullable for active turns
- `AttendanceRecord.arrivalTime: string | null` - nullable for some statuses
- `ListSettings.createdAt`, `ListSettings.updatedAt` - backend timestamps
