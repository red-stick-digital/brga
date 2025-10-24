# Copilot Instructions for Baton Rouge GA

> **📚 For comprehensive documentation, see [`docs/STARTER.md`](../docs/STARTER.md)**  
> This file contains essential quick-reference information loaded in every chat session.

## Project Type
React 18 + Vite 4 SPA with Supabase backend (PostgreSQL + Auth) and Tailwind CSS styling.

## Critical Architecture Facts

### Build System: Vite (NOT Create React App)
- Environment variables use `VITE_` prefix: `import.meta.env.VITE_SUPABASE_URL`
- Port config: `process.env.PORT || 3000` in `vite.config.js`
- Production build → `dist/` folder

### Authentication: Supabase v2
- **Hook**: `src/hooks/useAuth.js` → `{ user, loading, login, signup, logout }`
- **Client**: `src/services/supabase.js` (default export)
- **API**: Uses v2 methods (`signInWithPassword`, NOT v1's `signIn`)
- **Protection**: `ProtectedRoute` component wraps authenticated pages

### Database: Supabase (PostgreSQL)
- **RLS enabled** on all tables - policies control access, not just queries
- **Profile system**: `member_profiles` table with auto-creation trigger
- **Role system**: `user_roles` table with approval workflow
- **Schema**: See `database/schema.sql` for full structure

### Styling: Tailwind CSS
- Utility-first approach, no CSS modules
- Global styles: `src/styles/globals.css` (only Tailwind directives)
- Custom fonts: League Spartan and Helvetica
- Blue theme: `bg-blue-500`, `hover:bg-blue-700`

## File Locations (Quick Reference)
```
src/
├── hooks/
│   ├── useAuth.js              # Authentication state
│   └── useMemberProfile.js     # Profile data & operations
├── services/
│   └── supabase.js             # Supabase client config
├── utils/
│   └── profileCompletion.js    # Profile validation logic
├── components/
│   ├── Auth/                   # Login, SignUp
│   ├── MemberProfile/          # Profile forms
│   └── common/                 # Reusable UI (Button, modals)
└── pages/                      # Route components

database/
└── schema.sql                  # Tables, RLS policies, triggers

tests/e2e/                      # Playwright tests
```

## Common Gotchas & Critical Warnings

### 🚨 RLS Policy Pitfalls
- **Users CANNOT update their own `user_roles.approval_status`** due to RLS
- **Solution**: Use SECURITY DEFINER functions called via `.rpc()`, not direct UPDATE
- **Pattern**: `supabase.rpc('approve_user_with_code', { user_id_param })`
- **Why**: RLS policy requires `is_superadmin()` for UPDATE, new users aren't admins

### 🚨 Database Triggers Already Handle These
- **Profile creation**: Auto-created on signup (don't INSERT manually)
- **Role assignment**: Auto-assigned 'pending_member' on signup
- **Profile completion**: Auto-calculated when profile is saved
- **Check**: `database/schema.sql` trigger section before adding INSERT logic

### 🚨 Import Patterns
- Supabase client: `import supabase from '../../services/supabase'` (default export)
- Auth hook: `import { useAuth } from '../../hooks/useAuth'` (named export)
- Use relative paths with proper traversal (`../../`)

### 🚨 Testing Requirements
- Start dev server BEFORE running Playwright tests
- Use cleanup scripts after tests: `scripts/cleanup-test-users.js`
- Test database state persists between runs

## Debugging Philosophy

**When user reports an issue:**
1. ✅ Assume user followed instructions correctly
2. ✅ Assume code has a bug - investigate implementation first
3. ✅ Check RLS policies and triggers before assuming frontend issue
4. ❌ Don't ask user to "try again" without verifying the code
5. 📝 Document findings in task files to avoid repeat attempts

**Common issue patterns:**
- "Profile not loading" → Usually RLS policy blocking access, not missing data
- "Update not working" → Check RLS UPDATE policies and triggers
- "Can't sign up" → Check approval code system and role creation trigger

## Environment Variables (Required)
```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
RESEND_API_KEY=re_XxDKFExG_CQZb8nwACsi1B7c6a43Ap4cp  # For emails
PORT=3000  # Optional, defaults to 3000
```

## Quick Commands
```bash
npm run dev           # Dev server (localhost:3000)
npm run dev:full      # Dev server + API endpoints
npm run build         # Production build
npm run preview       # Test production build locally
npm run test:e2e      # Run Playwright tests
npm run test:e2e:ui   # Playwright with UI
```

## Recent Critical Fixes (Learn From These!)

### Approval Code Signup (Oct 2025)
- **Issue**: Users stayed "pending" after using approval code
- **Root cause**: Frontend tried to UPDATE `user_roles` directly - RLS blocked it
- **Solution**: Created `approve_user_with_code()` SECURITY DEFINER function
- **Lesson**: Privileged operations need database functions, not frontend queries
- **See**: `docs/Debugs/DEBUG_approval_code_signup.md`

### Profile Completion System (Oct 2025)
- **Pattern**: Auto-calculate `profile_complete` flag, don't trust manual updates
- **Fields**: first_name, last_name, email, clean_date, home_group_id
- **Modal**: `ProfileCompletionModal` prompts on login if incomplete
- **Utilities**: Use `src/utils/profileCompletion.js` for validation

## Tool Usage for This Project

### Editing Files
- **Always use** `replace_string_in_file` for edits (never terminal commands)
- **Include 3-5 lines of context** before/after to ensure unique match
- **Match whitespace exactly** (tabs vs spaces matter)
- **Never use placeholders** like `// ... existing code ...`

### Gathering Context
- **Start with** `semantic_search` for broad concepts
- **Use** `grep_search` for specific function/variable names
- **Read files in parallel** when possible (except semantic_search)
- **Check** `database/schema.sql` for RLS policies when debugging access issues

### Testing Changes
- **Run** `npm run dev` with `isBackground: true` before tests
- **Use** `get_terminal_output` to check server status
- **Execute** Playwright tests after auth/profile changes
- **Verify** `npm run preview` before declaring deployment-ready

---

**📚 For detailed information on:**
- Complete tech stack and versions
- Full database schema and RLS patterns
- Deployment checklists and rollback procedures
- Failed approaches log (what NOT to try)
- Testing strategies and gotchas
- Code editing best practices

**→ See [`docs/STARTER.md`](../docs/STARTER.md)**