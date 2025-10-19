# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment (Completed)

- [x] **Build Configuration**

  - Vite config optimized for production
  - Terser minification enabled
  - Code splitting configured (vendor, supabase, ui chunks)
  - Source maps disabled for production

- [x] **Vercel Configuration**

  - `vercel.json` created with proper settings
  - `_headers` file for security headers
  - `_redirects` file for SPA routing
  - `.vercelignore` configured

- [x] **Environment Variables**

  - `.env.example` created for reference
  - Production environment variables documented
  - Supabase credentials ready for Vercel dashboard

- [x] **Security**
  - Security headers configured
  - Content Security Policy set for Supabase
  - XSS and clickjacking protection enabled
  - HTTPS redirect configured

## 🔧 Deployment Steps

### 1. Repository Setup

- [ ] Push code to GitHub/GitLab/Bitbucket
- [ ] Ensure `.env` is not committed (it's in `.gitignore`)

### 2. Vercel Project Creation

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "New Project"
- [ ] Import your repository
- [ ] Verify auto-detected settings:
  - Framework: **Vite**
  - Build Command: `npm run build`
  - Output Directory: `dist`

### 3. Environment Variables (Critical!)

Set these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://nrpwrxeypphbduvlozbr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycHdyeGV5cHBoYmR1dmxvemJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODk5OTIsImV4cCI6MjA3NjQ2NTk5Mn0.XniYr49uEN0ljo55UJlVbH1Qsur2G04rMfe3YWVTF4s
```

### 4. Deploy

- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Check deployment logs for any errors

## 🧪 Post-Deployment Testing

### Authentication Testing

- [ ] Visit deployed site
- [ ] Test user registration (if applicable)
- [ ] **Test admin login**: `marsh11272@yahoo.com` / `#Lizabeth01`
- [ ] Verify admin panel access
- [ ] Test logout functionality

### Application Testing

- [ ] Navigate through all pages
- [ ] Test responsive design on mobile
- [ ] Verify all images/videos load correctly
- [ ] Check console for JavaScript errors
- [ ] Test protected routes

### Database Operations

- [ ] Test any CRUD operations
- [ ] Verify Supabase connection works
- [ ] Check RLS policies are enforced
- [ ] Test admin permissions

## 🔍 Performance Check

- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify asset optimization
- [ ] Test load times

## 🐛 Common Issues & Solutions

### Build Fails

```bash
# Clear cache and rebuild locally first
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working

- Double-check variable names (must start with `VITE_`)
- Verify values are correct in Vercel dashboard
- Redeploy after adding variables

### Authentication Issues

- Check browser network tab for 401/403 errors
- Verify Supabase URL and key in deployed environment
- Check if RLS policies are too restrictive

### Routing Issues

- Verify `_redirects` file is properly deployed
- Check Vercel function logs for routing errors

## 📊 Monitoring

### Vercel Dashboard

- [ ] Set up monitoring alerts
- [ ] Configure custom domain (optional)
- [ ] Enable Vercel Analytics

### Supabase Dashboard

- [ ] Monitor database usage
- [ ] Check authentication metrics
- [ ] Review API usage limits

## 🎉 Success Metrics

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Admin login works on production
- ✅ All pages load correctly
- ✅ Database operations function properly
- ✅ No console errors on key pages
- ✅ Mobile responsive design works
- ✅ Lighthouse score > 90

## 📝 Next Steps After Deployment

1. **Custom Domain** (Optional)

   - Purchase domain
   - Configure DNS
   - Add to Vercel project

2. **Performance Monitoring**

   - Set up error tracking (Sentry)
   - Configure uptime monitoring
   - Monitor Supabase usage

3. **Backup Strategy**
   - Regular database backups
   - Version control best practices
   - Environment variable backup

---

**Need Help?** Check the detailed `README-deployment.md` for troubleshooting steps!
