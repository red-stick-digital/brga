---
description: Repository Information Overview
alwaysApply: true
---

# Baton Rouge GA Information

## Summary

Baton Rouge GA is a web application built using React, Tailwind CSS, and Supabase for authentication. It serves as a platform for users to log in, sign up, and access personalized content through a dashboard system.

## Structure

- **src/**: Main source code directory
  - **components/**: UI components organized by function (Auth, Layout, common)
  - **pages/**: Page components (Home, Dashboard)
  - **hooks/**: Custom React hooks (useAuth)
  - **services/**: External service integrations (Supabase)
  - **styles/**: Global CSS and styling
- **public/**: Static assets
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

## Authentication

**Provider**: Supabase
**Implementation**: Custom useAuth hook with React context
**Methods**: signInWithPassword, signUp, signOut
**State Management**: Local component state with hooks

## Styling

**Framework**: Tailwind CSS
**Configuration**: PostCSS with Autoprefixer
**Pattern**: Utility-first CSS with consistent component styling
**Global Styles**: Minimal, only Tailwind directives in globals.css

## Application Structure

**Routing**: React Router with component-based routing
**Layout**: Header and Footer components wrap main content
**Pages**: Home and Dashboard as main views
**Auth Flow**: Login and SignUp components with form validation
**Component Pattern**: Functional components with hooks for state management
