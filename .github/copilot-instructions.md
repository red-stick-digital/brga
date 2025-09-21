# Copilot Instructions for Baton Rouge GA

## Project Overview
This is a React + Vite web application with Supabase authentication and Tailwind CSS styling. The app serves as a platform for user authentication with a dashboard system.

## Tech Stack & Key Dependencies
- **Build System**: Vite (not Create React App) - uses `import.meta.env` for environment variables
- **Authentication**: Supabase with custom `useAuth` hook pattern
- **Styling**: Tailwind CSS with PostCSS processing
- **Routing**: React Router with standard component-based routing in `App.jsx`

## Architecture Patterns

### Authentication Flow
- **Centralized auth**: `src/services/supabase.js` exports configured Supabase client
- **Auth hook**: `src/hooks/useAuth.js` provides `{ user, loading, login, signup, logout }` 
- **Import pattern**: Components import from `'../../services/supabase'` (note: inconsistent - useAuth imports with named import, Login imports default)
- **Auth methods**: Uses older Supabase v1 API (`signIn`, `signUp`, `signOut`) - may need updating for v2

### Component Structure
- **Layout**: `Header` and `Footer` wrap main content in `App.jsx` with `<main className="flex-grow">`
- **Auth components**: `Login` and `SignUp` in `src/components/Auth/` - handle their own state and errors
- **Common components**: Reusable `Button` component in `src/components/common/` with Tailwind classes
- **Pages**: `Home` and `Dashboard` in `src/pages/` directory

### Styling Conventions
- **Tailwind-first**: All components use utility classes, no custom CSS modules
- **Global styles**: Only Tailwind directives in `src/styles/globals.css`
- **Button pattern**: Blue theme (`bg-blue-500`, `hover:bg-blue-700`) with consistent padding (`px-4 py-2`)
- **Form styling**: Consistent input classes with shadow, border, and focus states

## Development Workflow

### Environment Setup
- **Environment variables**: Uses Vite env pattern with `VITE_` prefix
- **Required vars**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **No .env file**: Project expects manual .env creation (referenced in README but not included)

### Build Commands
```bash
npm run dev      # Development server (port 3000 or PORT env var)
npm run build    # Production build to dist/
npm run serve    # Preview production build
```

### Port Configuration
- **Development**: Uses `process.env.PORT || 3000` in `vite.config.js`
- **Environment loading**: Vite config manually loads dotenv (not automatic)

## Key Files to Understand
- `src/App.jsx` - Main routing and layout structure
- `src/hooks/useAuth.js` - Authentication state management
- `src/services/supabase.js` - Supabase client configuration
- `vite.config.js` - Custom port and dotenv configuration

## Common Patterns
- **State management**: Local component state with hooks, no global state library
- **Error handling**: Component-level error state (see `Login.jsx` error pattern)
- **Loading states**: Boolean loading flags with disabled UI states
- **Import paths**: Relative imports with proper directory traversal (`../../`)

## Potential Issues
- **Supabase API version**: Using deprecated v1 methods (`signIn` vs `signInWithPassword`)
- **Import inconsistency**: Mixed default/named imports for supabase client
- **Missing dependencies**: `react-router-dom` used but not in package.json dependencies