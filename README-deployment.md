# Vercel Deployment Guide - Baton Rouge GA

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/batonrougega)

## 📋 Pre-Deployment Checklist

1. **Supabase Configuration**

   - Your Supabase project is already configured: `https://nrpwrxeypphbduvlozbr.supabase.co`
   - Database schema is deployed and working
   - Admin user is set up and confirmed

2. **Environment Variables**
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

## 🔧 Vercel Setup Steps

### Option 1: Deploy via Vercel Dashboard

1. **Connect Repository**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository (GitHub/GitLab/Bitbucket)

2. **Configure Build Settings** (Auto-detected)

   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**

   ```
   VITE_SUPABASE_URL=https://nrpwrxeypphbduvlozbr.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycHdyeGV5cHBoYmR1dmxvemJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODk5OTIsImV4cCI6MjA3NjQ2NTk5Mn0.XniYr49uEN0ljo55UJlVbH1Qsur2G04rMfe3YWVTF4s
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your live site!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**

   ```bash
   vercel login
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

## 🔐 Security Considerations

### Supabase Security

- **Row Level Security (RLS)** is enabled on all tables
- **Authentication policies** protect user data
- **Admin role verification** prevents unauthorized access

### Vercel Security Headers

- Content Security Policy headers are configured
- XSS Protection enabled
- Frame options set to prevent clickjacking

## 🌐 Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click "Domains"
3. Add your custom domain (e.g., `batonrougega.org`)
4. Follow DNS setup instructions
5. SSL certificate will be auto-generated

## 🔄 Automatic Deployments

- **Production**: Deploys automatically on pushes to `main` branch
- **Preview**: Deploys automatically on pull requests
- **Development**: Use `vercel --prod` for manual production deploys

## 🐛 Troubleshooting

### Build Issues

- Ensure all environment variables are set in Vercel dashboard
- Check build logs for missing dependencies
- Verify `package.json` scripts are correct

### Runtime Issues

- Check Vercel function logs
- Verify Supabase connection in browser console
- Confirm RLS policies allow necessary operations

### Common Fixes

```bash
# Clear Vercel build cache
vercel --prod --force

# Redeploy with fresh build
vercel --prod
```

## 📊 Performance Optimization

- Static assets are automatically optimized
- Gzip compression enabled
- CDN caching configured
- Image optimization available for public images

## 🔧 Post-Deployment

1. **Test Authentication**

   - Verify login/logout works
   - Test admin panel access
   - Check protected routes

2. **Verify Database Operations**

   - Test CRUD operations
   - Confirm RLS policies work
   - Check admin user permissions

3. **Monitor Performance**
   - Use Vercel Analytics
   - Monitor Supabase usage
   - Check Core Web Vitals

## 📝 Notes

- The app uses **Vite** for building (not Create React App)
- **React Router** handles client-side routing
- **Supabase Auth** manages user authentication
- **Tailwind CSS** for styling
- **Responsive design** works across devices

Your app should be fully functional on Vercel with the same features as your local development environment!
