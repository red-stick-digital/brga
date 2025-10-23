# Performance Optimization Plan

## Current Status (Oct 23, 2025)

### Metrics

- **Performance Score:** 68/100 ⚠️ (improved from 63)
- **FCP:** 3.6s (target: <1.8s)
- **LCP:** 5.8s (target: <2.5s) ⚠️ (improved from 9.8s)
- **TBT:** 40ms (target: <200ms) ✅
- **CLS:** 0.049 (target: <0.1) ✅
- **SI:** 4.9s (target: <3.4s)

### Issues Identified

1. **Render blocking requests** - Est. savings: 450ms

   - Google Fonts loading
   - CSS blocking rendering

2. **Unused JavaScript** - Est. savings: 150 KiB

   - Vendor bundle could be optimized
   - Some unused code from dependencies

3. **Image delivery** - Est. savings: 558 KiB

   - Some images still not optimized
   - Missing modern formats for some assets

4. **Long main-thread tasks** - 3 tasks found
   - JavaScript parsing and execution

## Priority 1: Fix Render Blocking (Biggest Impact)

### Issue: Google Fonts Loading

Current implementation in `index.html` blocks rendering:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### Solution 1A: Self-Host Google Fonts (RECOMMENDED)

Download and serve fonts locally to eliminate external request.

**Benefits:**

- Eliminates render blocking
- Faster load time
- No external dependency
- Better privacy

**Implementation:**

1. Download League Spartan font files
2. Add to `/public/fonts/` directory
3. Update CSS with `@font-face` declarations
4. Use `font-display: swap` for better performance

### Solution 1B: Optimize Font Loading (Alternative)

If keeping Google Fonts:

```html
<!-- Preload critical font -->
<link
  rel="preload"
  href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&display=swap"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript>
  <link
    href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</noscript>
```

### Issue: Google Analytics Blocking

Current implementation loads synchronously in `<head>`.

**Solution:**
Move GA script to load asynchronously or defer:

```html
<!-- Current (blocking) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-SEC3DWJE6S"
></script>

<!-- Better: Move to end of body or use Partytown -->
```

## Priority 2: Optimize JavaScript Bundle

### Current Build Configuration

The `vite.config.js` has basic code splitting but can be improved.

### Solutions:

#### 2A: Improve Code Splitting

```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        // Separate large dependencies
        if (id.includes("node_modules")) {
          if (id.includes("react") || id.includes("react-dom")) {
            return "react-vendor";
          }
          if (id.includes("@supabase")) {
            return "supabase";
          }
          if (id.includes("@headlessui") || id.includes("@heroicons")) {
            return "ui-vendor";
          }
          // All other node_modules
          return "vendor";
        }
        // Separate page components
        if (id.includes("src/pages/")) {
          const pageName = id.split("src/pages/")[1].split(".")[0];
          return `page-${pageName.toLowerCase()}`;
        }
      };
    }
  }
}
```

#### 2B: Enable Compression

Add compression plugin:

```bash
npm install --save-dev vite-plugin-compression
```

```javascript
import viteCompression from "vite-plugin-compression";

plugins: [
  react(),
  viteCompression({
    algorithm: "brotliCompress",
    ext: ".br",
  }),
];
```

#### 2C: Lazy Load Routes

Update routing to lazy load pages:

```javascript
// Instead of:
import Home from "./pages/Home";

// Use:
const Home = lazy(() => import("./pages/Home"));
const HelpForGambling = lazy(() => import("./pages/HelpForGambling"));
// ... etc

// Wrap routes in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Routes>{/* routes */}</Routes>
</Suspense>;
```

## Priority 3: Additional Image Optimizations

### Check Remaining Images

Some images still need optimization (558 KiB potential savings).

**Actions:**

1. Check if all images were converted to WebP
2. Verify image dimensions are appropriate
3. Add lazy loading for below-fold images
4. Use responsive images with `srcset`

### Add Lazy Loading

```jsx
// For images below the fold
<img
  src="/images/home-bonsai.webp"
  alt="Bonsai tree"
  loading="lazy"
  decoding="async"
/>
```

### Add Responsive Images

```jsx
<img
  srcSet="/images/home-bonsai-400.webp 400w,
          /images/home-bonsai-800.webp 800w,
          /images/home-bonsai-1200.webp 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  src="/images/home-bonsai-800.webp"
  alt="Bonsai tree"
  loading="lazy"
/>
```

## Priority 4: Reduce Main Thread Work

### Solutions:

#### 4A: Use Web Workers for Heavy Tasks

If any heavy JavaScript processing, move to web worker.

#### 4B: Defer Non-Critical JavaScript

```html
<!-- Move non-critical scripts to end of body -->
<script defer src="/src/main.jsx"></script>
```

#### 4C: Use Request Idle Callback

For non-critical operations:

```javascript
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => {
    // Non-critical work
  });
} else {
  setTimeout(() => {
    // Non-critical work
  }, 1);
}
```

## Priority 5: Optimize CSS Delivery

### Current Issue

All CSS loads before rendering begins.

### Solution: Critical CSS

Extract critical above-the-fold CSS and inline it:

```html
<head>
  <style>
    /* Critical CSS for above-fold content */
    /* Tailwind base utilities for hero section */
  </style>
</head>
```

Use plugin: `vite-plugin-critical`

## Implementation Checklist

### Phase 1: Font Optimization (Biggest Impact)

- [ ] Download League Spartan font files
- [ ] Create `/public/fonts/` directory
- [ ] Add `@font-face` declarations to CSS
- [ ] Remove Google Fonts from `index.html`
- [ ] Test font loading

### Phase 2: JavaScript Optimization

- [ ] Update `vite.config.js` with improved code splitting
- [ ] Install and configure compression plugin
- [ ] Convert page imports to lazy loading
- [ ] Wrap routes in Suspense
- [ ] Test build size reduction

### Phase 3: Image Lazy Loading

- [ ] Audit all `<img>` tags
- [ ] Add `loading="lazy"` to below-fold images
- [ ] Add `decoding="async"` to all images
- [ ] Test lazy loading behavior

### Phase 4: Analytics Optimization

- [ ] Consider moving GA to end of body
- [ ] Or implement Partytown for web worker isolation
- [ ] Test analytics still working

### Phase 5: CSS Optimization

- [ ] Install critical CSS plugin
- [ ] Configure for production builds
- [ ] Test critical CSS extraction

## Expected Results

### Target Metrics After Optimization

- **Performance Score:** 85+ (from 68)
- **FCP:** <1.8s (from 3.6s)
- **LCP:** <2.5s (from 5.8s)
- **TBT:** <50ms (currently 40ms)
- **CLS:** <0.05 (currently 0.049)
- **SI:** <3.0s (from 4.9s)

### Impact by Priority

| Priority | Action             | Impact         | Effort |
| -------- | ------------------ | -------------- | ------ |
| 1        | Self-host fonts    | High (450ms)   | Medium |
| 2        | Code splitting     | Medium (150KB) | Medium |
| 3        | Image lazy loading | Medium (558KB) | Low    |
| 4        | Defer scripts      | Medium         | Low    |
| 5        | Critical CSS       | Medium         | High   |

## Quick Wins (Start Here)

These can be done quickly for immediate impact:

1. **Add lazy loading to images** (10 mins)

   - Add `loading="lazy"` attribute
   - Add `decoding="async"` attribute

2. **Defer Google Analytics** (5 mins)

   - Move GA script to end of body

3. **Self-host fonts** (30 mins)
   - Download and configure League Spartan

## Testing Strategy

After each change:

1. Build production: `npm run build`
2. Test locally: `npm run preview`
3. Deploy to staging/production
4. Run PageSpeed Insights
5. Compare metrics
6. Iterate if needed

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Self-Hosting Google Fonts](https://google-webfonts-helper.herokuapp.com/)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [React Lazy Loading](https://react.dev/reference/react/lazy)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)

---

**Next Steps:** Start with Priority 1 (Font Optimization) for the biggest impact.
