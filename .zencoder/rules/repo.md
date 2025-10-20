---
description: Repository Information Overview
alwaysApply: true
---

# Baton Rouge GA Information

## Summary

Baton Rouge GA is a web application for Gamblers Anonymous in the Baton Rouge area. It provides information about meetings, resources for gambling addiction, and a members-only section. The application is built with React, Vite, Tailwind CSS, and uses Supabase for authentication and database services.

## Structure

- **src/**: Main source code directory
  - **components/**: UI components (Auth, Admin, Layout, common)
  - **pages/**: Page components (Home, Meetings, Dashboard, etc.)
  - **hooks/**: Custom React hooks (useAuth, useEvents, useApprovalCode, etc.)
  - **services/**: External service integrations (Supabase)
  - **styles/**: Global CSS and Tailwind styling
- **public/**: Static assets (images, videos, documents)
- **database/**: SQL schema and seed data for Supabase
- **api/**: Serverless API endpoints (email services)
- **tests/**: Playwright E2E tests

## Language & Runtime

**Language**: JavaScript (React)
**Version**: React 18.0.0
**Build System**: Vite 4.0.0
**Package Manager**: npm

## Dependencies

**Main Dependencies**:

- React 18.0.0
- React Router 6.0.0
- Supabase JS 2.0.0
- Headless UI 2.2.8
- Hero Icons 2.0.18
- React Bootstrap 2.10.10
- Resend 6.2.0 (Email service)
- Date-fns 4.1.0

**Development Dependencies**:

- Vite 4.0.0
- Tailwind CSS 3.0.0
- PostCSS 8.0.0
- Playwright 1.56.1
- Express 5.1.0 (for dev API server)

## Build & Installation

```bash
# Install dependencies
npm install

# Development server (frontend only)
npm run dev

# Development server (API + frontend)
npm run dev:full

# Production build
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

**Required Variables**:

- VITE_SUPABASE_URL: Supabase project URL
- VITE_SUPABASE_ANON_KEY: Supabase anonymous key
- RESEND_API_KEY: API key for email service
- PORT: Development server port (default: 3000)

## Database

**Provider**: Supabase
**Schema**:

- announcements: Site announcements
- events: GA events and meetings
- user_roles: User permissions with approval status
- member_profiles: Member information and preferences
- home_groups: GA meeting groups
- approval_codes: Signup approval system

**Security**: Row-level security policies for protected data

## Authentication

**Provider**: Supabase Auth
**Implementation**: Custom useAuth hook
**Methods**: signInWithPassword, signUp, signOut
**Protected Routes**: ProtectedRoute component with role-based access

## Application Structure

**Routing**: React Router with component-based routing
**Layout**: Header and Footer components wrap main content
**Pages**: Multiple pages for different sections (public and protected)
**Components**:

- Auth: Login and SignUp components
- Admin: Administrative tools and dashboards
- Layout: Header and Footer
- Common: Reusable UI components

## Styling

**Framework**: Tailwind CSS
**Custom Fonts**: League Spartan and Helvetica
**Color Scheme**: Blues (#8BB7D1, #6B92B0) with black backgrounds
**Responsive Design**: Mobile-first approach with responsive components

## Testing

**Framework**: Playwright
**targetFramework**: Playwright
**Configuration**: Multi-browser testing (Chromium, Firefox, WebKit)
**Test Location**: tests/e2e directory
**Run Command**:

```bash
npm run test:e2e       # Run tests
npm run test:e2e:ui    # Run tests with UI
npm run test:e2e:debug # Run tests in debug mode
```
