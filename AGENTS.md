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
- Component files include a corresponding `.css` file with same name
- Use descriptive prop interfaces/types

```tsx
export const ComponentName: React.FC<PropsType> = ({ prop1, prop2 }) => {
  // implementation
};
```

### Naming Conventions
- **Components**: PascalCase (e.g., `AttendanceCall`, `CaddieManagement`)
- **Functions/variables**: camelCase (e.g., `handleSave`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY`, `ADMIN_PASSWORD`)
- **Types**: PascalCase (e.g., `AppContextType`, `ButtonProps`)
- **Interfaces**: PascalCase (e.g., `Caddie`, `Turn`, `AttendanceRecord`)

### Type Definitions
- Use `interface` for object shapes that can be extended
- Use `type` for unions, literals, and primitive types
- Define types in `src/types/index.ts` for shared types
- Use union types for string literals (e.g., `'Disponible' | 'En campo' | 'Ausente'`)

### State Management
- Primary state via React Context (`src/context/AppContext.tsx`)
- Use `useApp()` custom hook to access context
- Always call `useApp()` within `AppProvider` wrapper (throws error otherwise)
- Local state with `useState` for component-specific UI state
- Persist critical state to localStorage

### Error Handling
- Use early returns for validation: `if (!caddie) return;`
- Handle localStorage operations in try/catch blocks
- Check context availability: `if (!context) throw new Error(...)`

### Styling
- Plain CSS with separate `.css` files per component
- BEM-like class naming (e.g., `attendance-call`, `btn-primary`)
- Use className props for additional styling

### Routing
- React Router with `BrowserRouter`, `Routes`, `Route`
- Main routes in `src/App.tsx`
- `useNavigate()` hook for navigation

### Icon Components
- Use `Icon` component from `src/components/ui/Icon.tsx`
- Supports predefined icon names via `IconName` type
- Props: `{ name, className?, size? }`

### UI Components
- Reusable components in `src/components/ui/`
- Button component supports `variant?: 'primary' | 'default'`
- Extend native HTML element types for props: `React.ButtonHTMLAttributes<HTMLButtonElement>`

### Localization
- UI text and comments in Spanish (app is for Spanish-speaking users)
- Labels and messages in Spanish

### Idioms
- Use `...prev` spread for immutable state updates
- Filter and map with immutable patterns
- Date handling: `new Date().toISOString()` for storage, split for display
- IDs: Use timestamp-based unique IDs (e.g., `caddie_${Date.now()}`)
