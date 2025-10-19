---
description: Repository Information Overview
alwaysApply: true
---

# Baton Rouge GA Information

## Summary

Baton Rouge GA is a web application for Gamblers Anonymous in the Baton Rouge area. It provides information about meetings, resources for gambling addiction, and a members-only section. The application is built with React, Vite, Tailwind CSS, and uses Supabase for authentication and database services.

## Structure

- **src/**: Main source code directory
  - **components/**: UI components (Auth, Layout, common)
  - **pages/**: Page components (Home, Meetings, etc.)
  - **hooks/**: Custom React hooks (useAuth, useEvents, etc.)
  - **services/**: External service integrations (Supabase)
  - **styles/**: Global CSS and styling
- **public/**: Static assets (images, videos, documents)
- **database/**: SQL schema and seed data for Supabase
- **dist/**: Build output directory

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

**Development Dependencies**:

- Vite 4.0.0
- Tailwind CSS 3.0.0
- PostCSS 8.0.0
- Autoprefixer 10.0.0

## Build & Installation

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

**Required Variables**:

- VITE_SUPABASE_URL: Supabase project URL
- VITE_SUPABASE_ANON_KEY: Supabase anonymous key
- PORT: Development server port (default: 3000)

## Database

**Provider**: Supabase
**Schema**:

- announcements: For site announcements
- events: For GA events and meetings
- user_roles: For user permissions (admin, editor, member)

**Security**: Row-level security policies for protected data

## Authentication

**Provider**: Supabase
**Implementation**: Custom useAuth hook
**Methods**: signInWithPassword, signUp, signOut
**Protected Routes**: ProtectedRoute component using React Router

## Application Structure

**Routing**: React Router with component-based routing
**Layout**: Header and Footer components wrap main content
**Pages**: Multiple pages for different sections (Home, Meetings, etc.)
**Components**:

- Auth: Login and SignUp components
- Layout: Header and Footer
- Common: Reusable UI components (Button, Video)

## Styling

**Framework**: Tailwind CSS
**Custom Fonts**: League Spartan and Helvetica
**Color Scheme**: Blues (#8BB7D1, #6B92B0) with black backgrounds
**Responsive Design**: Mobile-first approach with responsive components
