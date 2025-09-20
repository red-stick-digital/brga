# NEW PROJECT SETUP GUIDE

## Next.js 15 + Supabase + Vercel Architecture

**Based on Marshall's List production architecture - Updated August 20, 2025**

---

## 🚀 **QUICK START OVERVIEW**

This guide will help you create a new Next.js project with the same robust architecture as Marshall's List:

- **Next.js 15.3.5** (App Router) with TypeScript
- **Supabase** for authentication and PostgreSQL database
- **Tailwind CSS v4** with custom design tokens
- **Vercel** deployment with optimized configuration
- **Resend API** for email notifications
- **Modern tooling** (ESLint, Prettier, etc.)

---

## 📋 **PREREQUISITES**

Before starting, ensure you have:

- **Node.js 18+** installed
- **Git** installed and configured
- **GitHub account** for repository hosting
- **Supabase account** (free tier available)
- **Vercel account** (free tier available)
- **Resend account** (optional, for email notifications)

---

## 🏗️ **STEP 1: PROJECT INITIALIZATION**

### 1.1 Create New Next.js Project

```bash
# Create new Next.js app with TypeScript
npx create-next-app@latest your-project-name --typescript --tailwind --app --eslint

# Navigate to project directory
cd your-project-name
```

### 1.2 Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Create GitHub repository (replace with your details)
gh repo create your-project-name --public --clone

# Or manually create repository on GitHub and add remote
git remote add origin https://github.com/yourusername/your-project-name.git
```

### 1.3 Initial Commit

```bash
git add .
git commit -m "Initial Next.js 15 project setup"
git push -u origin main
```

---

## 📦 **STEP 2: INSTALL CORE DEPENDENCIES**

### 2.1 Supabase Dependencies

```bash
npm install @supabase/auth-helpers-nextjs@^0.10.0 @supabase/auth-helpers-react@^0.5.0 @supabase/ssr@^0.6.1 @supabase/supabase-js@^2.50.3
```

### 2.2 Essential Production Dependencies

```bash
npm install react-icons@^5.5.0 resend@^4.6.0 next-sitemap@^4.2.3 dotenv@^17.2.0
```

### 2.3 Development Dependencies

```bash
npm install -D prettier@^3.6.2 prettier-plugin-tailwindcss@^0.6.14 @eslint/eslintrc@^3
```

### 2.4 Optional Dependencies (Based on Your Needs)

```bash
# For phone number input
npm install react-phone-number-input@^3.4.12

# For image compression
npm install browser-image-compression@^2.0.2

# For recurring date rules
npm install rrule@^2.8.1

# For advanced deployment
npm install vercel@^44.7.3
```

---

## 🎨 **STEP 3: TAILWIND CSS V4 SETUP**

### 3.1 Upgrade to Tailwind CSS v4

```bash
npm install -D tailwindcss@^4 @tailwindcss/postcss@^4
```

### 3.2 Replace `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // Enable automatic dark mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design Token System
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        page: 'var(--color-bg-page)',
        card: 'var(--color-bg-card)',
        border: {
          DEFAULT: 'var(--color-border)',
        },
        link: {
          DEFAULT: 'var(--color-link)',
        },
        btn: {
          primary: {
            bg: 'var(--color-btn-primary-bg)',
            text: 'var(--color-btn-primary-text)',
          },
          secondary: {
            bg: 'var(--color-btn-secondary-bg)',
            text: 'var(--color-btn-secondary-text)',
          },
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
        },
        // Your Brand Colors (customize these)
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
          accent: 'var(--brand-accent)',
          neutral: 'var(--brand-neutral)',
          dark: 'var(--brand-dark)',
          light: 'var(--brand-light)',
        },
      },
    },
  },
  plugins: [],
};
```

### 3.3 Update `src/app/globals.css`

```css
@import 'tailwindcss';
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Browser Compatibility */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}

:root {
  /* Design Tokens - Customize for Your Brand */

  /* Light Mode Colors */
  --color-text-primary: #1f2937;
  --color-text-secondary: #4b5563;
  --color-text-tertiary: #6b7280;

  --color-bg-page: #ffffff;
  --color-bg-card: #f9fafb;
  --color-border: #e5e7eb;
  --color-link: #3b82f6;
  --color-accent: #10b981;

  --color-btn-primary-bg: #3b82f6;
  --color-btn-primary-text: #ffffff;
  --color-btn-secondary-bg: #f3f4f6;
  --color-btn-secondary-text: #374151;

  /* Your Brand Colors - CUSTOMIZE THESE */
  --brand-primary: #3b82f6;
  --brand-secondary: #10b981;
  --brand-accent: #f59e0b;
  --brand-neutral: #6b7280;
  --brand-dark: #1f2937;
  --brand-light: #f9fafb;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark Mode Colors */
    --color-text-primary: #f9fafb;
    --color-text-secondary: #d1d5db;
    --color-text-tertiary: #9ca3af;

    --color-bg-page: #111827;
    --color-bg-card: #1f2937;
    --color-border: #374151;
    --color-link: #60a5fa;
    --color-accent: #34d399;

    --color-btn-primary-bg: #3b82f6;
    --color-btn-primary-text: #ffffff;
    --color-btn-secondary-bg: #374151;
    --color-btn-secondary-text: #d1d5db;
  }
}

body {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
  line-height: 1.6;
}

/* Add your custom global styles here */
```

---

## ⚙️ **STEP 4: NEXT.JS CONFIGURATION**

### 4.1 Update `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure proper transpilation
  transpilePackages: ['@supabase/auth-helpers-nextjs'],

  // Configure image domains (add your specific domains)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-project.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Common image services
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
  },

  // Remove console.logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 4.2 Update `package.json` Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,css,md}\"",
    "tailwind:sort": "prettier --write \"src/**/*.{js,jsx,ts,tsx}\" --plugin=prettier-plugin-tailwindcss"
  }
}
```

---

## 🗄️ **STEP 5: SUPABASE SETUP**

### 5.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose region closest to your users
4. Wait for project to be ready

### 5.2 Environment Variables

Create `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (optional)
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@yourdomain.com

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5.3 Basic Supabase Client Setup

Create `src/lib/supabase.ts`:

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createClient = () => createClientComponentClient()

export const createServerClient = () => createServerComponentClient({ cookies })

export const createRouteHandlerSupabaseClient = () => createRouteHandlerClient({ cookies })
```

### 5.4 Database Schema Example

In Supabase SQL Editor, create basic tables:

```sql
-- Enable RLS
alter table auth.users enable row level security;

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  screen_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 🔐 **STEP 6: AUTHENTICATION SETUP**

### 6.1 Create Auth Context

Create `src/contexts/AuthContext.tsx`:

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 6.2 Update Root Layout

Update `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Your Project Name',
  description: 'Your project description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

---

## 📁 **STEP 7: PROJECT STRUCTURE**

### 7.1 Create Directory Structure

```bash
mkdir -p src/{components,hooks,lib,types,utils}
mkdir -p src/app/{auth,dashboard,api}
mkdir -p src/components/{ui,forms,layout}
mkdir -p docs
```

### 7.2 Recommended Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

---

## 🚀 **STEP 8: VERCEL DEPLOYMENT**

### 8.1 Connect to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel

# Follow prompts to connect GitHub repository
```

### 8.2 Environment Variables in Vercel

In Vercel dashboard, add all environment variables from `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_BASE_URL` (set to your Vercel domain)

### 8.3 Automatic Deployments

Vercel will automatically deploy on every push to main branch.

---

## 🔧 **STEP 9: DEVELOPMENT TOOLS**

### 9.1 Create `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 9.2 Update `.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

### 9.3 Create `.gitignore` additions

```bash
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDEs
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

## ✅ **STEP 10: VERIFICATION & TESTING**

### 10.1 Test Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to verify everything works.

### 10.2 Test Build

```bash
npm run build
npm start
```

### 10.3 Basic Authentication Test

Create a simple login/register page to test Supabase integration.

---

## 🎯 **NEXT STEPS**

After completing this setup, you're ready to build your application with:

✅ **Modern Next.js 15** with App Router  
✅ **Supabase authentication** and database  
✅ **Tailwind CSS v4** with design tokens  
✅ **TypeScript** for type safety  
✅ **Vercel deployment** configured  
✅ **Development tools** (Prettier, ESLint)

### Recommended Next Actions:

1. **Design System**: Customize the design tokens in `globals.css`
2. **Database Schema**: Design your specific database tables
3. **Authentication**: Build login/register components
4. **Core Features**: Start building your main application features
5. **Testing**: Add testing framework (Jest, Cypress, etc.)

---

## 📚 **ADDITIONAL RESOURCES**

- **Next.js 15 Documentation**: https://nextjs.org/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Last Updated:** August 20, 2025  
**Architecture Version:** Based on Marshall's List production setup  
**Status:** Production-Ready Template
