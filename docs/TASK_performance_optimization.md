# TASK: Performance Optimization - PageSpeed Improvements

**Created**: October 23, 2025  
**Status**: In Progress  
**Priority**: High

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

---

## TASK DESCRIPTION

Optimize website performance based on PageSpeed Insights recommendations to improve Core Web Vitals and overall user experience.

### Initial Performance Baseline (Oct 23, 2025)

- **Performance Score**: 68/100
- **FCP**: 3.6s
- **LCP**: 5.8s (target: <2.5s)
- **TBT**: 40ms
- **CLS**: 0.049

---

## COMPLETED STEPS

### ✅ October 23, 2025 - Initial Optimizations

1. **Image Lazy Loading**

   - Added `loading="lazy"` and `decoding="async"` to 9 below-fold images
   - Files modified: `src/pages/Home.jsx`, `src/pages/HelpForGambling.jsx`
   - Estimated savings: ~500KB initial load reduction

2. **Attempted Font Loading Optimization** ❌

   - Tried async font loading with preload
   - **Result**: FAILED - Caused blank page in production
   - **Rolled back**: Reverted to standard font loading

3. **Attempted Advanced Vite Build Configuration** ❌

   - Tried custom asset naming and advanced code splitting
   - **Result**: FAILED - MIME type errors, CSS served as HTML
   - **Error**: `Refused to apply style... MIME type ('text/html') is not a supported stylesheet`
   - **Rolled back**: Reverted to simple Vite config

4. **Working Configuration**
   - Basic code splitting (vendor, supabase, ui bundles)
   - Standard Vite asset paths
   - Image lazy loading active

---

## CURRENT STATUS

### Latest PageSpeed Report (Oct 23, 2025 - 7:06 PM)

- **URL**: https://pagespeed.web.dev/analysis/https-www-batonrougega-org/l3tz9m20z6?form_factor=mobile
- **Performance Score**: 74/100 (+6 from baseline!)
- **FCP**: 3.7s (similar to baseline 3.6s)
- **LCP**: 4.5s ✅ (improved from 5.8s, but target is <2.5s)
- **TBT**: 0ms ✅ (excellent, was 40ms)
- **CLS**: 0.049 ✅ (excellent, unchanged)
- **SI**: 4.9s (unchanged)

### Improvements Achieved

- ✅ **+6 point** performance score increase (68 → 74)
- ✅ **-1.3s** LCP improvement (5.8s → 4.5s) - 22% faster!
- ✅ **-40ms** TBT improvement (40ms → 0ms)
- ✅ Image lazy loading working effectively

### Remaining Opportunities

1. **Render blocking requests** - Est. 450ms savings
   - Google Fonts still blocking render
2. **Image delivery** - Est. 379 KiB savings
   - Some images still need optimization
3. **Unused JavaScript** - Est. 150 KiB savings
   - Bundle size optimization needed
4. **Long main-thread tasks** - 2 tasks found
   - JavaScript execution optimization

---

## ISSUES ENCOUNTERED

### Issue 1: Async Font Loading Broke Production

- **Date**: Oct 23, 2025
- **Problem**: Using `onload` attribute on font preload caused blank page
- **Root Cause**: JavaScript in font loading interfered with page rendering
- **Solution**: Reverted to standard font loading
- **Commit**: `a5c028a - fix: revert font loading optimization that caused display issues`

### Issue 2: Custom Vite Asset Paths Broke Build

- **Date**: Oct 23, 2025
- **Problem**: CSS file served as HTML, React hooks error
- **Root Cause**: Custom `assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'` broke file serving
- **Console Errors**:
  - `Uncaught TypeError: Cannot read properties of undefined (reading 'useSyncExternalStore')`
  - `MIME type ('text/html') is not a supported stylesheet MIME type`
- **Solution**: Reverted to default Vite asset naming
- **Commit**: `49a67d8 - fix: revert vite build config changes that broke production build`

---

## NEXT STEPS

### Phase 1: Low-Risk, High-Impact Optimizations (SAFE)

1. [ ] **Self-host Google Fonts** (450ms savings potential)

   - Download League Spartan font files
   - Add to `/public/fonts/` directory
   - Update CSS with `@font-face`
   - **Risk**: Low - no JavaScript, just CSS
   - **Test command**: `npm run build && npm run preview`

2. [ ] **Add font-display: swap to current font loading**

   - Quick CSS-only change
   - Improves perceived performance
   - **Risk**: Very low - single parameter change

3. [ ] **Preload critical assets**
   - Add `<link rel="preload">` for hero images
   - Only for above-the-fold content
   - **Risk**: Low - well-supported feature

### Phase 2: Moderate Optimizations (TEST CAREFULLY)

4. [ ] **Optimize remaining images**

   - Check which images still need WebP conversion
   - Verify file sizes are appropriate
   - **Risk**: Low - same process as before

5. [ ] **Add explicit width/height to images**
   - Reduces CLS
   - Better performance score
   - **Risk**: Very low - just attributes

### Phase 3: Advanced Optimizations (PROCEED WITH CAUTION)

6. [ ] **Consider route-based code splitting**

   - Lazy load page components with `React.lazy()`
   - Only if comfortable with React patterns
   - **Risk**: Medium - requires testing all routes

7. [ ] **Remove unused CSS/JS**
   - Use Vite's built-in tree shaking
   - Audit dependencies
   - **Risk**: Medium - need to test thoroughly

### Testing Protocol for Each Change

```bash
# 1. Make change
# 2. Test locally
npm run build
npm run preview
# Open localhost:4173 - verify page works

# 3. Check build output
ls -lh dist/assets/

# 4. Commit and push
git add .
git commit -m "perf: [description of change]"
git push

# 5. Wait 3-5 minutes for deployment
# 6. Test production site
# 7. Run PageSpeed Insights
```

---

## LESSONS LEARNED

1. **Test production builds locally** - Always run `npm run preview` before deploying
2. **Avoid complex build configurations** - Vite defaults work well, custom configs can break things
3. **JavaScript in HTML attributes is risky** - Especially for critical resources like fonts
4. **One change at a time** - Deploy incrementally to identify what breaks
5. **Monitor console errors** - MIME type and module errors indicate build issues

---

## FILES MODIFIED

### Active Changes (Working)

- `src/pages/Home.jsx` - Image lazy loading (5 images)
- `src/pages/HelpForGambling.jsx` - Image lazy loading (4 images)
- `vite.config.js` - Basic code splitting

### Reverted Changes

- `index.html` - Reverted async font loading
- `vite.config.js` - Reverted custom asset paths and terser options

---

**Last Updated**: October 23, 2025 - Awaiting new PageSpeed analysis
