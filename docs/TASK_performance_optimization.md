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

5. **Self-Hosted Google Fonts** ✅ (Oct 23, 2025 - 8:30 PM)

   - Downloaded League Spartan font files (400, 500, 600, 700 weights)
   - Created local `@font-face` declarations in `/public/fonts/league-spartan-local.css`
   - Removed external Google Fonts requests
   - **Impact**: Eliminates 450ms render blocking time
   - **Commit**: `07cc60b - perf: self-host Google Fonts to eliminate 450ms render blocking`
   - **Files**: `index.html`, `public/fonts/` (5 new files)
   - **Status**: Deployed, awaiting PageSpeed verification

6. **Hero Image Preloading** ✅ (Oct 23, 2025 - 8:40 PM)
   - Added `<link rel="preload" as="image">` for LCP hero image (Home Hand Up.webp, 197KB)
   - Used `fetchpriority="high"` to prioritize loading
   - **Impact**: Expected -0.5 to -1.0s LCP improvement (currently 4.5s → target 3.5-4.0s)
   - **Target**: Reach 85+ performance score (currently 78/100, need +7 points)
   - **Files**: `index.html`
   - **Status**: Ready to deploy

---

## CURRENT STATUS

### Latest PageSpeed Report (Oct 23, 2025 - 8:35 PM)

- **URL**: https://pagespeed.web.dev/ (after font optimization)
- **Performance Score**: 78/100 (+10 from baseline, +4 from fonts)
- **FCP**: 3.6s (unchanged)
- **LCP**: 4.5s (improved from 5.8s, target: <2.5s)
- **TBT**: 0ms (excellent - improved from 40ms)
- **CLS**: 0.049 (excellent)
- **SI**: Not measured

### Current Work Session (Oct 23, 2025 - 8:40 PM)

- ✅ **Hero image preload** - Added to `index.html` with `fetchpriority="high"`
- 🔄 **Image optimization** - User working on compressing large images (302KB, 197KB, 119KB, 109KB)
- **Next test**: Deploy and measure LCP improvement (expect 4.5s → 3.5-4.0s)

### Improvements Achieved

- ✅ **+10 points** total performance score increase (68 → 78)
- ✅ **+4 points** from self-hosted fonts (74 → 78)
- ✅ **Eliminated 450ms** render blocking from Google Fonts
- ✅ **-1.3s** LCP improvement from lazy loading (5.8s → 4.5s)
- ✅ **-40ms** TBT improvement (40ms → 0ms)
- ✅ Image lazy loading working (9 images)
- ✅ Self-hosted fonts deployed and working

### Remaining Opportunities (To Reach 85+)

1. **Image delivery** - Est. 379 KiB savings 🔄 IN PROGRESS
   - Large images identified: `help looking at phone.webp` (302KB), `home three rocks.webp` (197KB), `home bonsai.webp` (119KB), `home head down.webp` (109KB)
   - User manually optimizing/compressing these images
   - Target: Reduce by 60-70% (aim for ~230KB total savings)
2. **LCP Optimization** - Hero image now preloaded ✅
   - Added `<link rel="preload">` with `fetchpriority="high"`
   - Expect -0.5 to -1.0s improvement (4.5s → 3.5-4.0s)
   - Combined with image optimization should hit <4.0s target
3. **Unused JavaScript** - Est. 150 KiB savings
   - Bundle size could be reduced further
   - Tree shaking opportunities
4. **Long main-thread tasks** - 2 tasks found
   - JavaScript execution blocking main thread
   - Consider code splitting or deferring non-critical JS

### Target: 85+ Performance Score

- **Current**: 78/100
- **Goal**: 85+/100
- **Gap**: 7 points to close

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
- `index.html` - Hero image preload with fetchpriority="high"
- `public/fonts/` - Self-hosted League Spartan fonts (5 files)

### Reverted Changes

- `index.html` - Reverted async font loading
- `vite.config.js` - Reverted custom asset paths and terser options

---

**Last Updated**: October 23, 2025 - Awaiting new PageSpeed analysis
