# STARTER FILE - Baton Rouge GA Project

## IMPORTANT: READ FIRST

1. **This is a starter file.** The first step is to copy this file and rename it referencing the task that is being requested (e.g., `TASK_auth_upgrade.md`, `DEBUG_email_issue.md`).

2. **This new file should be referenced before any work is started** and it should be updated after any major step is completed.

3. **Copy everything in # PROJECT OVERVIEW to the new file.**

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
  "react": "18.0.0",
  "react-router-dom": "6.0.0",
  "@supabase/supabase-js": "2.0.0",
  "@headlessui/react": "2.2.8",
  "@heroicons/react": "2.0.18",
  "react-bootstrap": "2.10.10",
  "resend": "6.2.0",
  "date-fns": "4.1.0"
}
```

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

---

## COMMON PATTERNS & CONVENTIONS

### State Management

- Local component state with React hooks
- No global state management library
- Custom hooks for shared logic (`useAuth`, `useEvents`, etc.)

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
- Supabase config: `src/services/supabase.js`
- Global styles: `src/styles/globals.css`
- Test files: `tests/e2e/*.spec.js`

---

## TASK TRACKING TEMPLATE

### For Upgrades:

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

### For Debugging:

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

**Last Updated**: [Insert date when making changes to this starter file]
**Project Version**: [Current project state/version]
