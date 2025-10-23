# Baton Rouge GA - Project Overview

## Summary

Baton Rouge GA is a web application for Gamblers Anonymous in the Baton Rouge area. It provides information about meetings, resources for gambling addiction, and a members-only portal with authentication, member profiles, directory, and administrative tools.

## Technical Stack

**Frontend**:
- React 18.0.0
- Vite 4.0.0 (build system)
- React Router 6.0.0
- Tailwind CSS 3.0.0

**Backend Services**:
- Supabase (authentication & PostgreSQL database)
- Resend 6.2.0 (email service)

**Testing**:
- Playwright 1.56.1 (E2E tests)

**Package Manager**: npm

## Project Structure

```
batonrougega/
├── src/
│   ├── components/
│   │   ├── Auth/           # Login, SignUp, ResetPassword
│   │   ├── Admin/          # Admin tools and dashboards
│   │   ├── Layout/         # Header, Footer, MemberNav
│   │   ├── Directory/      # Member directory components
│   │   ├── MemberProfile/  # Profile view and edit forms
│   │   └── common/         # Reusable UI components (Button, etc.)
│   ├── pages/
│   │   ├── AuthHome.jsx           # Authenticated home with events/announcements
│   │   ├── MemberDirectory.jsx   # Member directory (protected)
│   │   ├── MemberProfile.jsx     # Member profile editor (protected)
│   │   ├── AdminDashboard.jsx    # Admin dashboard (protected)
│   │   └── [public pages...]     # Home, Meetings, FAQ, etc.
│   ├── hooks/
│   │   ├── useAuth.js            # Authentication hook
│   │   ├── useUserRole.js        # User role and approval status
│   │   ├── useEvents.js          # Events management
│   │   ├── useAnnouncements.js   # Announcements management
│   │   ├── useDirectory.js       # Member directory
│   │   ├── useMemberProfile.js   # Profile CRUD
│   │   ├── useApprovalCode.js    # Approval code validation
│   │   └── [other hooks...]
│   ├── services/
│   │   └── supabase.js           # Supabase client configuration
│   ├── utils/                    # Utility functions
│   └── styles/                   # Global CSS and Tailwind
├── public/                       # Static assets
│   ├── images/
│   ├── video/
│   └── documents/
├── database/                     # SQL schemas and migrations
│   ├── member_portal_schema.sql  # Core schema
│   ├── fix_signup_profile_creation.sql
│   └── [other migrations...]
├── api/                          # Serverless API endpoints
│   ├── send-email.js
│   ├── send-custom-email.js
│   └── send-speaker-request.js
├── tests/e2e/                    # Playwright tests
└── docs/                         # Documentation
```

## Key Features

### Public Features
- Meeting information and locations
- Resources for gambling addiction (20 Questions, First Meeting guide)
- Contact form
- Speaker request form
- Gam-Anon information
- FAQ and GA information

### Member Portal (Protected)
- **Authentication**: Email/password with approval code system
- **Member Profile**: Customizable profile with directory visibility settings
- **Member Directory**: Searchable directory with contact information
- **Events & Announcements**: View upcoming events and important announcements
- **Home Groups**: Assignment and management of GA home groups
- **Approval System**: Pending/approved status for new members

### Admin Features (Superadmin/Admin Only)
- User management and approval
- Approval code generation
- Events and announcements creation/editing
- Member directory management
- Home group management

## Database Schema

**Tables**:
- `announcements`: Site-wide announcements
- `events`: GA events and meetings
- `user_roles`: User permissions with approval status (pending/approved)
- `member_profiles`: Member information, preferences, directory visibility
- `home_groups`: GA meeting groups with location/time info
- `approval_codes`: Signup approval code system

**Security**: Row-level security (RLS) policies protect all tables

## Authentication Flow

1. **Signup**:
   - Optional approval code (auto-approves if valid)
   - Email verification required
   - Creates `user_roles` (pending/approved) and `member_profiles` entries
   - Database trigger ensures both tables are populated

2. **Login**:
   - Email/password authentication via Supabase
   - Redirects to `/authhome` after successful login
   - Protected routes check authentication state

3. **User States**:
   - **Pending**: Can view limited content, prompted to complete profile
   - **Approved**: Full member access to directory and features
   - **Admin/Superadmin**: Additional administrative permissions

## Routing Structure

### Public Routes
- `/` - Home page
- `/meetings` - Meeting information
- `/myfirstmeeting` - First meeting guide
- `/20questions` - Self-assessment
- `/contactus` - Contact form
- `/aboutgamblersanonymous` - About GA
- `/eventsandannouncements` - Public events
- `/faq` - Frequently asked questions
- `/helpforgambling` - Resources
- `/login` - Login page
- `/signup` - Signup page

### Protected Routes (Requires Authentication)
- `/authhome` - Authenticated home with events/announcements
- `/memberdirectory` - Member directory
- `/member/profile` - Member profile editor
- `/admin/dashboard` - Admin dashboard (admin/superadmin only)

## Navigation System

**Primary Header** (always visible):
- Logo and site name
- Public navigation links
- Hamburger menu for additional pages
- Login button (logged out) / No button (logged in)

**Secondary Navigation** (MemberNav - logged in only):
- Home → `/authhome`
- Directory → `/memberdirectory`
- Profile → `/member/profile`
- Admin → `/admin/dashboard` (admins only)
- Logout

## Build & Development

```bash
# Install dependencies
npm install

# Development (frontend only)
npm run dev

# Development (API + frontend)
npm run dev:full

# Production build
npm run build

# Preview production build
npm run preview

# Run E2E tests
npm run test:e2e
npm run test:e2e:ui      # with UI
npm run test:e2e:debug   # debug mode
```

## Environment Variables

**Required**:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
PORT=3000  # optional, defaults to 3000
```

## Deployment

**Platform**: Vercel
**Repository**: red-stick-digital/brga
**Branch**: main
**Auto-deploy**: Enabled on push to main
**Site URL**: www.batonrougega.org

## Styling

**Framework**: Tailwind CSS 3.0.0
**Approach**: Utility-first CSS
**Fonts**:
- League Spartan (headings)
- Helvetica (body text)

**Color Palette**:
- Blue: `#8BB7D1`, `#6B92B0`
- Backgrounds: Black (`#000000`), Gray (`#F7F7F7`)
- Accent: Blue-600 for member navigation

**Responsive**: Mobile-first design with responsive breakpoints

## Recent Updates (October 2025)

1. **Navigation Redesign**:
   - Added MemberNav secondary navigation for logged-in users
   - Simplified primary header to show only Login/Logout
   - Hamburger menu auto-closes on mouse leave

2. **Route Changes**:
   - Renamed `/member/dashboard` → `/member/profile`
   - Created `/authhome` as main authenticated landing page
   - Separated `/memberdirectory` from AuthHome

3. **Bug Fixes**:
   - Fixed signup profile/role creation (database trigger + code)
   - Fixed approval code validation (RLS policies)
   - Fixed member profile update fields

4. **UI Improvements**:
   - AuthHome shows events/announcements (not directory)
   - Pending approval screen for users without codes
   - Profile completion tracking

## Documentation

See `/docs` folder for additional documentation:
- `TASK_auth_improvements_and_ui_upgrade.md` - Recent improvements
- `SECURITY_ANALYSIS.md` - Security considerations
- `EMAIL_SETUP_SUMMARY.md` - Email configuration
- `SUPABASE_EMAIL_SETUP.md` - Supabase email setup
- SEO documentation files

## Testing

**Framework**: Playwright
**Browsers**: Chromium, Firefox, WebKit
**Test Coverage**:
- Authentication flows
- Password reset security
- Session management
- Member profile updates
- Protected route access

## Support & Maintenance

**Repository**: https://github.com/red-stick-digital/brga
**Issues**: GitHub Issues
**Deployment**: Vercel auto-deploy from main branch
