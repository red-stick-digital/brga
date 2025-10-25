# STARTER FILE - Baton Rouge GA Project

## IMPORTANT: READ FIRST

1. **This is a starter file.** The first step is to copy this file and rename it referencing the task that is being requested (e.g., `TASK_auth_upgrade.md`, `DEBUG_email_issue.md`).

2. **This new file should be referenced before any work is started** and it should be updated after any major step is completed.

3. **Copy everything after and including # PROJECT OVERVIEW to the new file.**

4. **If being used for an upgrade,** each major phase of the upgrade should be listed and the anticipated steps to accomplish each phase outlined.

5. **If this file is being used for debugging or fixing a workflow,** this file should be referenced before each attempt at debugging and each attempt at fixing the code should be logged as soon as possible so that no unsuccessful attempts are repeated.

6. **The last step when completing an upgrade or successful debugging** of a problem should be to update STARTER.md with any changes to the project.

---

# PROJECT OVERVIEW

**Application**: Baton Rouge GA (Gamblers Anonymous) web application  
**Purpose**: Information about meetings, resources for gambling addiction, and members-only section  
**Architecture**: React SPA with Supabase backend

---

## TECH STACK & VERSIONS

### Core Technologies

- **Frontend**: React 18.0.0 with Vite 4.0.0 (NOT Create React App)
- **Styling**: Tailwind CSS 3.0.0 with PostCSS
- **Routing**: React Router 6.0.0
- **Authentication**: Supabase Auth 2.0.0
- **Database**: Supabase (PostgreSQL)
- **Testing**: Playwright 1.56.1 (`targetFramework: Playwright`)
- **Email Service**: Resend 6.2.0
- **Package Manager**: npm

### Key Dependencies

```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "@headlessui/react": "^2.2.8",
  "@heroicons/react": "^2.0.18",
  "react-bootstrap": "^2.10.10",
  "react-helmet-async": "^2.0.5",
  "resend": "^6.2.0",
  "date-fns": "^4.1.0",
  "dotenv": "^17.2.3"
}
```

### Dev Dependencies

```json
{
  "@playwright/test": "^1.56.1",
  "@vitejs/plugin-react": "^4.0.0",
  "autoprefixer": "^10.0.0",
  "express": "^5.1.0",
  "postcss": "^8.0.0",
  "tailwindcss": "^3.0.0",
  "terser": "^5.44.0",
  "vite": "^4.0.0"
}
```

---

## AI ASSISTANT GUIDELINES

### Tool Usage Strategy for This Project

**When making changes to existing files:**

- Use `replace_string_in_file` with 3-5 lines of context before/after
- NEVER use terminal commands (`sed`, `awk`) to edit files
- Read the full file first if unsure of context

**When gathering context:**

- Start with `semantic_search` for broad topics
- Use `grep_search` with regex for specific patterns
- Use `list_code_usages` when changing function signatures
- Read files in parallel when possible (not `semantic_search`)

**When testing changes:**

- Always use `run_in_terminal` with `isBackground: true` for servers
- Use `get_terminal_output` to check server status
- Run Playwright tests after auth/profile changes
- Check `npm run preview` before declaring deployment-ready

**When debugging:**

- Read the actual implementation first (trust user's report)
- Check database policies via Supabase dashboard or SQL files
- Look for RLS policy issues before blaming frontend code
- Document attempts immediately to avoid repetition

### File Reading Strategy

**For authentication issues:**

1. `src/hooks/useAuth.js` - Auth state management
2. `src/services/supabase.js` - Client configuration
3. `src/components/Auth/Login.jsx` or `SignUp.jsx` - UI implementation
4. `database/schema.sql` - Check RLS policies

**For profile/member data issues:**

1. `src/hooks/useMemberProfile.js` - Profile data hook
2. `src/components/MemberProfile/` - Profile UI components
3. `src/utils/profileCompletion.js` - Profile validation logic
4. `database/schema.sql` - member_profiles table and triggers

**For routing/navigation issues:**

1. `src/App.jsx` - Main routing configuration
2. `src/components/ProtectedRoute.jsx` - Auth protection
3. Individual page components in `src/pages/`

**For styling issues:**

1. `src/styles/globals.css` - Global styles and Tailwind config
2. `tailwind.config.js` - Tailwind configuration
3. Component files - Inline Tailwind classes

**For database issues:**

1. `database/schema.sql` - Table definitions and RLS
2. `database/*_migration.sql` - Migration files
3. Relevant trigger files in `database/fix_trigger_*.sql`

---

## PROJECT STRUCTURE

```
src/
├── components/
│   ├── Auth/           # Login, SignUp components
│   ├── Admin/          # Administrative tools and dashboards
│   ├── Layout/         # Header, Footer
│   ├── MemberProfile/  # Profile view and edit forms
│   └── common/         # Reusable UI components (Button, ProfileCompletionModal, etc.)
├── pages/              # Page components (Home, Meetings, Dashboard, etc.)
├── hooks/              # Custom React hooks (useAuth, useEvents, useMemberProfile)
├── services/           # Supabase client configuration
├── utils/              # Utility functions (profileCompletion, nameUtils, etc.)
└── styles/             # Global CSS and Tailwind

public/                 # Static assets (images, videos, documents)
database/              # SQL schema and seed data for Supabase
api/                   # Serverless API endpoints (email services)
tests/                 # Playwright E2E tests
docs/                  # Documentation files
```

---

## ENVIRONMENT SETUP

### Required Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=re_XxDKFExG_CQZb8nwACsi1B7c6a43Ap4cp
PORT=3000
```

### Development Commands

```bash
# Install dependencies
npm install

# Frontend only development server
npm run dev

# Development server with API (full stack)
npm run dev:full

# Production build
npm run build

# Preview production build
npm run preview

# Run Playwright E2E tests
npm run test:e2e
npm run test:e2e:ui    # With UI
npm run test:e2e:debug # Debug mode
```

---

## DATABASE SCHEMA (Supabase)

### Main Tables

- **announcements**: Site announcements and notifications
- **events**: GA events and meeting schedules
- **user_roles**: User permissions with approval status system
- **member_profiles**: Extended member information and preferences (includes `profile_complete` flag)
- **home_groups**: GA meeting group information
- **approval_codes**: Signup approval system for member access

### Member Profile Fields

The `member_profiles` table includes:

- **Name fields**: `first_name`, `middle_initial`, `last_name` (full_name is deprecated)
- **Contact**: `email`, `phone`
- **GA Info**: `clean_date`, `home_group_id`
- **Preferences**: `listed_in_directory`, `willing_to_sponsor`, `share_phone_in_directory`, `share_email_in_directory`
- **Status**: `profile_complete` (boolean) - auto-calculated based on required fields
- **Officer**: `officer_position` (optional)

**Required fields for completion**: first_name, last_name, email, clean_date, home_group_id

### Security Model

- Row-level security (RLS) enabled on all protected tables
- Role-based access control through `user_roles` table
- Approval system for new member registrations

### Database Quick Reference

**Common Supabase Client Patterns:**

```javascript
// Query with RLS automatically applied
const { data, error } = await supabase
  .from("member_profiles")
  .select("*")
  .eq("user_id", user.id)
  .single();

// Insert with automatic user context
const { data, error } = await supabase
  .from("member_profiles")
  .insert([{ field: value }]);

// Update with RLS filtering
const { data, error } = await supabase
  .from("member_profiles")
  .update({ field: value })
  .eq("user_id", user.id);

// Call RPC function (for privileged operations)
const { data, error } = await supabase.rpc("function_name", {
  param1: value1,
});
```

**Key RLS Patterns in This Project:**

- `member_profiles`: Users can read their own, members can read directory-listed profiles
- `user_roles`: Users can read their own roles, **only superadmins can UPDATE**
- `events`: Public read, admin write
- `home_groups`: Public read, admin write
- `approval_codes`: Admin only

**Important RLS Constraint:**

- Users CANNOT update their own `user_roles.approval_status` due to RLS
- Solution: Use SECURITY DEFINER functions (e.g., `approve_user_with_code()`)
- Call via RPC: `supabase.rpc('approve_user_with_code', { user_id_param })`

**Database Triggers:**

- **Profile Creation**: Auto-creates `member_profiles` record on user signup
- **Role Assignment**: Auto-assigns 'pending_member' role on signup
- **Profile Completion**: Auto-calculates `profile_complete` field on save

**Common Database Issues:**

1. **"Row not found" errors**: Usually RLS policy blocking access, not missing data
2. **Profile not auto-created**: Check trigger is enabled and role exists
3. **Can't update profile**: Verify user_id matches authenticated user
4. **Directory not showing**: Check `listed_in_directory` AND `profile_complete` both true

---

## AUTHENTICATION FLOW

### Architecture

- **Service**: `src/services/supabase.js` - Configured Supabase client
- **Hook**: `src/hooks/useAuth.js` - Provides `{ user, loading, login, signup, logout }`
- **API**: Uses Supabase Auth v2 (`signInWithPassword`, `signUp`, `signOut`)
- **Protection**: `ProtectedRoute` component with role-based access

### Import Patterns

```javascript
// Supabase client (default export)
import supabase from "../../services/supabase";

// Auth hook (named export)
import { useAuth } from "../../hooks/useAuth";
```

---

## STYLING CONVENTIONS

### Tailwind Setup

- **Framework**: Tailwind CSS with utility-first approach
- **Custom Fonts**: League Spartan and Helvetica
- **Color Scheme**: Blues (#8BB7D1, #6B92B0) with black backgrounds
- **Responsive**: Mobile-first design approach

### Component Patterns

```javascript
// Button styling pattern
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">

// Input styling pattern
<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
```

---

## TESTING FRAMEWORK

### Playwright Configuration

- **Framework**: Playwright (multi-browser: Chromium, Firefox, WebKit)
- **Location**: `tests/e2e/` directory
- **Config**: `playwright.config.js` in project root
- **Pattern**: Test files follow `*.spec.js` naming convention

### Running Tests

```bash
npm run test:e2e              # Run all tests
npm run test:e2e:ui           # Run with Playwright UI
npm run test:e2e:debug        # Debug mode
npx playwright show-report    # View test results
```

---

## EMAIL SYSTEM

### Current Setup

- **Service**: Resend API for transactional emails
- **API Key**: `re_XxDKFExG_CQZb8nwACsi1B7c6a43Ap4cp`
- **Authentication Emails**: Handled by Supabase (can be configured with custom SMTP)
- **Configuration**: See `docs/SUPABASE_EMAIL_SETUP.md` for detailed setup

### SMTP Options

- Supabase built-in (development)
- Resend SMTP (recommended - centralized)
- Alternative providers (SendGrid, Mailgun)

---

## DEBUGGING PHILOSOPHY

**CRITICAL RULE**: When a user reports an issue:

1. **Assume the user followed instructions correctly** - they probably did
2. **Assume the code or workflow has a bug** - investigate the code first
3. **Check the code/logic BEFORE asking user to retry** - verify the implementation
4. **Document findings** - update task files with root cause analysis

Do NOT immediately assume user error. Trust the user's report and investigate systematically.

### Recognizing User Intent Patterns

**When user says "X isn't working":**

- First: Check if feature actually exists/is implemented
- Second: Verify the expected behavior in code
- Third: Check for RLS/permission issues
- Last: Consider user environment/browser issues

**When user says "Can you add X?":**

- Check if X already exists but isn't visible/accessible
- Check if X is partially implemented but incomplete
- Consider dependencies (database, auth, other features)
- Plan the full scope before starting

**When user says "This should do Y but does Z":**

- This is a LOGIC BUG report - investigate the code immediately
- Don't ask user to retry - they already did
- Find the condition/logic that causes Z instead of Y
- Fix and document the root cause

**When user says "Following the docs but...":**

- Documentation may be outdated - check actual code
- Feature may have changed - verify current implementation
- Docs may be wrong - trust the code, not the docs
- Update docs after fixing if needed

---

## COMMON PATTERNS & CONVENTIONS

### State Management

- Local component state with React hooks
- No global state management library
- Custom hooks for shared logic (`useAuth`, `useEvents`, `useMemberProfile`, etc.)

### Profile Completion System

**Feature**: Users are prompted to complete their profile on login if required fields are missing.

- **Modal**: `ProfileCompletionModal` appears after login if `profile_complete = false`
- **Auto-calculation**: `profile_complete` field is automatically set when profile is saved
- **Required fields**: first_name, last_name, email, clean_date, home_group_id
- **Utilities**: Use `src/utils/profileCompletion.js` for completion checks
- **Behavior**: Modal is dismissable but reappears on each login until profile is complete

### Error Handling

```javascript
// Component-level error state pattern
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

// Usage in try/catch blocks
try {
  setLoading(true);
  // API call
} catch (error) {
  setError(error.message);
} finally {
  setLoading(false);
}
```

### Import Paths

- Relative imports with proper directory traversal
- Consistent pattern: `'../../services/supabase'`

---

## DEPLOYMENT & BUILD

### Build Process

- Vite handles bundling and optimization
- Static assets served from `public/` directory
- Environment variables prefixed with `VITE_`
- Production build outputs to `dist/`

### Port Configuration

```javascript
// vite.config.js
export default {
  server: {
    port: process.env.PORT || 3000,
  },
};
```

---

## KNOWN ISSUES & CONSIDERATIONS

### Potential Issues

1. **Supabase API**: Currently using v2 API (up to date)
2. **Import Consistency**: Mixed default/named imports in some places
3. **Dependencies**: Ensure all required packages are in `package.json`
4. **Email Delivery**: May need domain verification for production

### Development Notes

- Server starts at `/Users/marshallnaquin/projects/batonrougega`
- Always use absolute paths for tools and operations
- Check for running terminals before starting new servers
- Background server startup recommended for testing workflow

---

## FAILED APPROACHES LOG

**Document what NOT to try - saves time on future debugging**

### Font Loading (October 2025)

❌ **Don't use JavaScript async loading for critical fonts**

- Attempted: `<link onload="this.onload=null;this.rel='stylesheet'">`
- Result: Blank page, fonts never loaded
- Reason: JavaScript execution blocked by missing fonts
- Solution: Standard `<link rel="stylesheet">` works fine

❌ **Don't customize Vite asset file naming**

- Attempted: Custom `assetFileNames` in `vite.config.js`
- Result: CSS/JS files served with wrong MIME types
- Reason: Vite's default naming includes type detection
- Solution: Use default Vite naming convention

❌ **Don't use advanced Terser minification options**

- Attempted: Custom `terserOptions` for aggressive compression
- Result: React module loading errors in production
- Reason: Broke module resolution and exports
- Solution: Use default `minify: 'terser'` without custom options

### Authentication Issues

❌ **Don't assume user error first**

- Pattern: User reports login not working
- Wrong approach: "Did you enter the right password?"
- Right approach: Check RLS policies, trigger logs, actual code
- Common cause: Database policy blocking profile creation

### Profile Completion

✅ **Auto-calculation works better than manual flags**

- Old approach: User manually marks profile complete
- Problem: Users forgot, profiles incomplete in directory
- Solution: Auto-calculate based on required fields
- Implementation: Database trigger or frontend utility

### Approval Code Signup (October 2025)

❌ **Don't try to UPDATE user_roles directly from frontend after signup**

- Attempted: Direct UPDATE query to set approval_status = 'approved'
- Result: UPDATE silently failed, users remained 'pending'
- Reason: RLS policy `FOR UPDATE USING (is_superadmin())` blocked new users
- Root cause: New users aren't superadmins, so RLS denied the update
- Solution: Use SECURITY DEFINER database function to bypass RLS

❌ **Don't INSERT into user_roles after signup (trigger already created it)**

- Attempted: INSERT with 'approved' status, using ON CONFLICT DO NOTHING
- Result: INSERT ignored because row already exists from trigger
- Reason: Database trigger `handle_new_user()` creates row immediately
- Lesson: Check for existing triggers before planning INSERT logic

✅ **Use SECURITY DEFINER functions for privileged operations**

- Pattern: User needs to update their own restricted data during signup
- Solution: Create database function with SECURITY DEFINER
- Example: `approve_user_with_code(user_id)` bypasses RLS
- Call via: `supabase.rpc('function_name', { params })`
- Security: Function validates operation before executing

### Performance Optimization

❌ **Don't optimize everything at once**

- Attempted: Fonts + images + code splitting + terser all at once
- Result: Hard to debug which change broke production
- Solution: Optimize one category at a time, test between each

---

## DEPENDENCY CONSTRAINTS

### Version Compatibility

**React 18.x Requirements:**

- Must use `react-dom` ^18.0.0 (same major version)
- `@vitejs/plugin-react` ^4.0.0 compatible
- Vite 4.x fully supports React 18

**Supabase 2.x:**

- Uses `signInWithPassword` (not v1's `signIn`)
- Requires `@supabase/supabase-js` ^2.0.0
- Auth configuration object structure changed from v1

**Tailwind 3.x:**

- Requires PostCSS 8.x
- Autoprefixer 10.x compatible
- JIT mode enabled by default (no config needed)

**Playwright 1.56.1:**

- Node.js 18+ required
- Runs on Chromium, Firefox, WebKit
- Config file must be in project root

### Known Conflicts

**None currently documented** - update this section if version conflicts arise

### Upgrade Considerations

**When upgrading React:**

- Check Vite plugin compatibility
- Test all hooks (especially useAuth, useMemberProfile)
- Verify Supabase client still works

**When upgrading Supabase:**

- Review auth API changes
- Test RLS policies (behavior can change)
- Check trigger compatibility

**When upgrading Tailwind:**

- Regenerate production build
- Test all responsive breakpoints
- Verify custom colors/fonts still work

---

## TESTING GOTCHAS

### Playwright-Specific Issues

**Test Database State:**

- Tests may create user accounts that persist
- Use cleanup scripts: `scripts/cleanup-test-users.js`
- Or use test-specific email pattern (e.g., `test-*@example.com`)

**Authentication in Tests:**

- Must wait for Supabase session to establish
- Use `page.waitForURL()` after login actions
- Check for auth token in localStorage/cookies

**Timing Issues:**

- Database triggers are async (may need `waitForTimeout`)
- Modal animations can cause flakiness (wait for visibility)
- API calls may need retry logic

**Running Tests:**

- Start dev server BEFORE running tests: `npm run dev`
- Use `--ui` mode for debugging: `npm run test:e2e:ui`
- Check `playwright-report/index.html` for failure details

**Common Test Failures:**

- "Locator not found": Element may be behind modal/overlay
- "Timeout": Server not running or slow database query
- "Navigation failed": Check for console errors in test output

### Manual Testing Checklist

**After Auth Changes:**

- [ ] Can sign up new user
- [ ] Can log in existing user
- [ ] Can log out
- [ ] Protected routes redirect properly
- [ ] Session persists on refresh

**After Profile Changes:**

- [ ] Profile loads correctly
- [ ] Can edit and save profile
- [ ] Validation works (required fields)
- [ ] Directory visibility toggles work
- [ ] Profile completion modal appears when needed

**After Database Changes:**

- [ ] RLS policies don't block legitimate access
- [ ] Triggers fire correctly (check Supabase logs)
- [ ] Foreign keys don't prevent valid operations
- [ ] Indexes improve query performance

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment Verification

**Build Test:**

```bash
npm run build
npm run preview
# Test the production build locally at http://localhost:4173
```

**Environment Variables:**

- [ ] `VITE_SUPABASE_URL` set correctly
- [ ] `VITE_SUPABASE_ANON_KEY` set correctly
- [ ] `RESEND_API_KEY` set (if using email)
- [ ] No `.env.local` secrets committed to git

**Performance Check:**

- [ ] Run PageSpeed Insights on preview build
- [ ] Images are compressed and lazy-loaded
- [ ] Fonts are self-hosted (no external CDN blocking)
- [ ] Code splitting working (check dist/assets/ folder)

**Functionality Check:**

- [ ] Login/signup works
- [ ] Protected routes are actually protected
- [ ] Profile loading and editing works
- [ ] Directory displays correctly
- [ ] Email sending works (if applicable)

**Database Check:**

- [ ] All migrations applied to production database
- [ ] RLS policies enabled on all tables
- [ ] Triggers are enabled and working
- [ ] Indexes created for performance

**Security Check:**

- [ ] No API keys in frontend code
- [ ] RLS policies tested and working
- [ ] Auth sessions expire correctly
- [ ] CORS configured properly for API endpoints

### Post-Deployment Verification

**Immediate Checks (within 5 minutes):**

- [ ] Site loads without errors
- [ ] Can complete a full user journey (signup → login → dashboard)
- [ ] Check browser console for errors
- [ ] Verify Supabase connection working

**Within 24 Hours:**

- [ ] Monitor error rates in Supabase logs
- [ ] Check PageSpeed score on production URL
- [ ] Test from different devices/browsers
- [ ] Verify email delivery (if applicable)

---

## EMERGENCY ROLLBACK

### Quick Rollback Commands

**If deployment breaks production:**

```bash
# If using git-based deployment (Vercel, Netlify, etc.)
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <previous-commit-hash>
git push -f origin main

# If using manual deployment
# Redeploy the previous working build from dist-backup/
```

### Database Rollback

**If database migration breaks things:**

```sql
-- Most migrations have a "down" version
-- Check database/migration_*.sql for rollback steps

-- General pattern:
-- 1. Drop the new columns/tables
-- 2. Restore old columns/constraints
-- 3. Re-enable old triggers

-- Emergency read-only mode (if needed):
-- Disable all INSERT/UPDATE/DELETE in RLS policies
-- Allows diagnosis without further damage
```

### Backup Strategy

**Before any major change:**

```bash
# Backup current production build
cp -r dist dist-backup-$(date +%Y%m%d)

# Backup database (via Supabase dashboard)
# Projects > Settings > Database > Database Backups

# Backup environment config
cp .env .env.backup
```

**What to backup regularly:**

- Production build (`dist/` folder)
- Environment variables (`.env`)
- Database backups (Supabase daily automatic + manual before migrations)
- Git tags for stable releases

### Recovery Steps

**If site is broken:**

1. **Identify the issue**: Check browser console, Supabase logs, server logs
2. **Assess severity**: Can users access anything? Is data at risk?
3. **Quick fix or rollback**: If fix isn't obvious in 5 minutes, rollback
4. **Communicate**: Update status page/users if public-facing issue
5. **Fix properly**: After rollback, fix in dev, test thoroughly, redeploy
6. **Post-mortem**: Document what went wrong in FAILED APPROACHES LOG

---

## QUICK REFERENCE COMMANDS

### Project Navigation

```bash
cd /Users/marshallnaquin/projects/batonrougega

# Check running processes
ps aux | grep node

# Start development server (background)
npm run dev &

# View server logs
tail -f server.log
```

### Common File Locations

- Main app: `src/App.jsx`
- Auth hook: `src/hooks/useAuth.js`
- Member profile hook: `src/hooks/useMemberProfile.js`
- Supabase config: `src/services/supabase.js`
- Profile utilities: `src/utils/profileCompletion.js`
- Profile modal: `src/components/common/ProfileCompletionModal.jsx`
- Global styles: `src/styles/globals.css`
- Test files: `tests/e2e/*.spec.js`

---

## TASK TRACKING TEMPLATE

### For Upgrades

```markdown
## UPGRADE PHASES

- [ ] Phase 1: [Description]
  - [ ] Step 1.1: [Details]
  - [ ] Step 1.2: [Details]
- [ ] Phase 2: [Description]
  - [ ] Step 2.1: [Details]

## COMPLETED STEPS

- ✅ [Date] [Step completed with notes]

## ISSUES ENCOUNTERED

- [Date] [Issue description and resolution]
```

### For Debugging

```markdown
## DEBUG LOG

- [Date/Time] Attempt 1: [What was tried]
  - Result: [Success/Failure with details]
- [Date/Time] Attempt 2: [What was tried]
  - Result: [Success/Failure with details]

## ROOT CAUSE

- [Final diagnosis]

## SOLUTION APPLIED

- [What fixed the issue]
```

---

## CONTEXT GATHERING EFFICIENCY

### When to Use Which Tool

**Use `semantic_search` when:**

- You need to understand a broad concept ("how does profile completion work?")
- Looking for files that might contain certain functionality
- User asks "where is X implemented?"
- First step in unfamiliar codebase exploration

**Use `grep_search` when:**

- Looking for specific function/variable names
- Finding all usages of a particular string
- Case-sensitive or regex pattern matching needed
- Faster than semantic search for exact matches

**Use `file_search` when:**

- You know the filename pattern but not exact location
- Looking for all files of a certain type (_.sql, _.test.js)
- Finding configuration files

**Use `list_code_usages` when:**

- About to rename a function/class
- Need to see all places a function is called
- Understanding the impact of changing an API

**Use `read_file` when:**

- Need the full implementation details
- Context from search results is insufficient
- Want to see exact code structure/formatting
- Preparing to make edits

### Parallel vs Sequential Tool Calls

**Call in parallel (same tool block):**

- Reading multiple unrelated files
- Searching different patterns across codebase
- Checking multiple file locations

**Call sequentially (wait for results):**

- `semantic_search` (always sequential - can be slow)
- When second call depends on first results
- When gathering context before making edits

### Minimal Context Strategy

**Don't read everything - be surgical:**

```
❌ Bad: Read entire 500-line component to fix one button
✅ Good: Search for button text, read that section only

❌ Bad: Read all 10 profile-related files to fix validation
✅ Good: Search for validation logic, read that specific file

❌ Bad: Read full database schema to check one column
✅ Good: Grep for table name, read that section only
```

---

## COMMON MODIFICATION PATTERNS

### Adding a New Profile Field

1. **Database**: Add column to `member_profiles` table
2. **Backend**: Update RLS policies if field is sensitive
3. **Types**: Update any TypeScript interfaces (if applicable)
4. **Form**: Add input field to `MemberProfile/ProfileForm.jsx`
5. **Hook**: Update `useMemberProfile.js` if special handling needed
6. **Validation**: Update `profileCompletion.js` if required field
7. **Test**: Add test case to profile E2E tests

### Adding a New Protected Route

1. **Component**: Create page component in `src/pages/`
2. **Route**: Add to `App.jsx` wrapped in `<ProtectedRoute>`
3. **Navigation**: Add link to `Header.jsx` (if needed)
4. **Role Check**: Add role requirement to `ProtectedRoute` if needed
5. **Test**: Add E2E test for route protection

### Adding a New Database Table

1. **Schema**: Create table in `database/schema.sql`
2. **RLS**: Add policies for table access
3. **Seed**: Add sample data to `seed_data.sql` (optional)
4. **Migration**: Create migration SQL file with timestamp
5. **Frontend**: Create service/hook for table access
6. **Test**: Add database test cases

### Debugging RLS Policy Issues

1. **Reproduce**: Confirm the exact operation that fails
2. **Check Auth**: Verify user is authenticated and has correct role
3. **Check Policy**: Find policy in `database/schema.sql`
4. **Test Query**: Run query directly in Supabase SQL editor
5. **Check Logs**: View real-time logs in Supabase dashboard
6. **Fix Policy**: Update policy SQL, test again
7. **Document**: Add to FAILED APPROACHES if non-obvious

---

## CODE EDITING BEST PRACTICES

### Using replace_string_in_file Correctly

**Always include sufficient context:**

```javascript
// ❌ BAD - Too little context (might match multiple places)
oldString: "const [loading, setLoading] = useState(false);";

// ✅ GOOD - 3-5 lines of unique context
oldString: `
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
`;
```

**Match whitespace exactly:**

```javascript
// ❌ BAD - Wrong indentation
oldString: "if (user) {\n  return <Dashboard />;\n}";

// ✅ GOOD - Exact whitespace from file
oldString: "  if (user) {\n    return <Dashboard />;\n  }";
```

**Never use placeholder comments:**

```javascript
// ❌ BAD - AI placeholders break the match
oldString: `
  // ... existing code ...
  const handleSubmit = async () => {
`;

// ✅ GOOD - Full actual code
oldString: `
  const [formData, setFormData] = useState({});
  
  const handleSubmit = async () => {
`;
```

### When replace_string_in_file Fails

**Common reasons and solutions:**

1. **"String not found"**:

   - Read the file first to see actual content
   - Copy exact text including whitespace
   - Check for tabs vs spaces

2. **"Multiple matches found"**:
   - Add more surrounding context lines
   - Include unique nearby code (function name, imports)
3. **"Ambiguous match"**:
   - Include the full function or component
   - Add imports or surrounding functions as context

### File Creation Strategy

**When to create new files vs edit existing:**

- **Create new** when adding a distinct feature/component
- **Edit existing** when modifying behavior of current code
- **Split file** when existing file exceeds ~300 lines or has multiple concerns

### Import Management

**After adding new dependencies:**

1. Verify in `package.json` that dependency exists
2. Use correct import syntax (default vs named)
3. Check if it needs to be in `dependencies` or `devDependencies`
4. Restart dev server if adding new package

---

## RECENT UPDATES

### October 24, 2025 - Verification Field Anti-Spam Feature

- ✅ Added verification text field to signup form to help identify legitimate users vs bots
- ✅ Conditional validation: Required only when no approval code is provided
- ✅ Anti-spam protection: Blocks URLs and suspicious patterns via validation utilities
- ✅ Character limits: 500 character maximum with visual counter display
- ✅ Admin interface enhancement: Verification info displayed in blue highlighted sections
- ✅ Database schema update: Added `verification_info` TEXT column to `member_profiles`
- ✅ RLS bypass solution: Created `update_profile_verification_info()` SECURITY DEFINER function
- 📄 Components: `SignUp.jsx`, `PendingMembersList.jsx`, `verificationValidation.js`
- 🗄️ Database: `member_portal_schema.sql`, `function_update_verification_info.sql`
- 🎯 Result: Effective spam prevention with user-friendly conditional validation

### October 24, 2025 - MemberNav Architecture Improvement

- ✅ Integrated MemberNav into Header component (was separate component)
- ✅ Fixed MemberNav positioning issues on Home page (fixed header)
- ✅ Simplified App.jsx structure (removed separate MemberNav import)
- ✅ MemberNav now inherits Header positioning (fixed on Home, static elsewhere)
- ✅ Removed standalone `src/components/Layout/MemberNav.jsx` file
- 📄 See: `docs/Debugs/TASK_ui_mobile_fixes.md` for complete details
- 🎯 Result: Consistent navigation behavior across all pages

### October 24, 2025 - Project File Cleanup

- ✅ Removed 25 completed migration scripts from `/scripts`
- ✅ Removed 12 database debugging files from `/database`
- ✅ Removed 2 root directory test files
- ✅ Archived 4 completed task documentation files to `/docs/Archive`
- 📄 See: `docs/TASK_file_cleanup_review.md` for complete list
- 🎯 Result: Cleaner project structure with 29 files removed/archived

### October 24, 2025 - Approval Code Signup Fix

- ✅ Fixed approval code signup not setting users to 'approved' status
- ✅ Root cause: RLS policies blocked users from updating their own approval_status
- ✅ Solution: Created `approve_user_with_code()` database function with SECURITY DEFINER
- ✅ Updated `useAuth.js` to call RPC function instead of direct UPDATE
- ✅ Fixed email confirmation redirect from /dashboard to /authhome
- ✅ Fixed redirect URL to use dynamic port detection instead of hardcoded 3000
- 📄 See: `docs/Debugs/DEBUG_approval_code_signup.md` for complete debugging log
- 🗄️ Migration: `database/fix_approval_code_update.sql`

### October 23, 2025 - Profile Completion Feature

- ✅ Added profile completion tracking system
- ✅ Modal prompts users to complete profile on login
- ✅ Replaced `full_name` field with `first_name`, `middle_initial`, `last_name`
- ✅ Added `profile_complete` boolean field (auto-calculated)
- ✅ Created `ProfileCompletionModal` component
- ✅ Created `profileCompletion.js` utility functions
- 📄 See: `docs/TASK_profile_completion_modal.md` for details

### October 23, 2025 - Performance Optimization

- ✅ Improved PageSpeed score from 68 to 77 (+9 points, 13% improvement)
- ✅ Self-hosted Google Fonts (eliminated 450ms render blocking)
- ✅ Implemented image lazy loading (9 images across 2 pages)
- ✅ Added hero image preloading with fetchpriority="high"
- ✅ Compressed 4 large images (~400KB total savings)
- ✅ Basic Vite code splitting (vendor, supabase, ui bundles)
- 📊 Core Web Vitals: LCP improved 29% (5.8s → 4.1s), TBT perfect (0ms)
- 📄 See: `docs/TASK_performance_optimization.md` for complete details

---

## PERFORMANCE OPTIMIZATIONS APPLIED

### Images

- **Lazy Loading**: All below-fold images use `loading="lazy"` and `decoding="async"`
- **Hero Preload**: LCP element preloaded with `<link rel="preload" as="image" fetchpriority="high">`
- **Compression**: Large WebP images manually optimized (60-70% size reduction)
- **Files**: Check `src/pages/Home.jsx` and `src/pages/HelpForGambling.jsx` for patterns

### Fonts

- **Self-Hosted**: League Spartan fonts (4 weights) served from `/public/fonts/`
- **No External Requests**: Eliminated Google Fonts CDN (was 450ms blocking)
- **Implementation**: `index.html` links to `/fonts/league-spartan-local.css`
- **Files**: `/public/fonts/league-spartan-*.ttf` (52KB each)

### Build Configuration

- **Code Splitting**: Vite config splits vendor (React), Supabase, and UI libraries
- **Asset Paths**: Use default Vite naming (custom paths broke MIME types)
- **Minification**: Standard Vite defaults (custom terser options caused issues)
- **File**: `vite.config.js` - Keep configuration simple

### What NOT to Do (Lessons from Failed Attempts)

- ❌ **Don't use JavaScript in font loading** - Async `onload` attributes caused blank page
- ❌ **Don't customize Vite asset paths** - Custom naming breaks MIME type detection
- ❌ **Don't use advanced terser options** - Interferes with React module loading
- ⚠️ **Always test production builds locally** - Run `npm run preview` before deploying

---

**Last Updated**: October 24, 2025  
**Project Version**: v1.3 - Approval Code Signup Fixed

## CHANGELOG FOR THIS STARTER FILE

### October 24, 2025 - Approval Code Signup Debug

Fixed critical approval code signup issue and documented patterns:

- **Approval Code Fix**: Users now properly approved when using valid approval codes
- **RLS Pattern**: Documented SECURITY DEFINER functions for privileged operations
- **Failed Approaches**: Added approval code debugging lessons
- **Database Functions**: Added RPC pattern to Database Quick Reference
- **Email Redirect Fix**: Corrected confirmation email redirect to /authhome

### October 24, 2025 - Major Enhancement for AI Assistance

Added comprehensive sections to improve AI-assisted development:

- **AI Assistant Guidelines**: Tool usage strategies, file reading patterns
- **Database Quick Reference**: Common Supabase patterns, RLS issues, trigger behavior
- **Failed Approaches Log**: Document what NOT to try (saves debugging time)
- **Dependency Constraints**: Version compatibility and upgrade considerations
- **Testing Gotchas**: Playwright-specific issues and manual test checklists
- **Deployment Checklist**: Pre/post-deployment verification steps
- **Emergency Rollback**: Quick recovery procedures for production issues
- **Context Gathering Efficiency**: When to use which search/read tools
- **Common Modification Patterns**: Step-by-step guides for typical changes
- **Code Editing Best Practices**: How to use `replace_string_in_file` correctly
- **Recognizing User Intent**: Patterns for interpreting user requests accurately

**Purpose**: This file now serves as a comprehensive guide for AI assistants working on this project, reducing repeated mistakes and improving debugging efficiency.
