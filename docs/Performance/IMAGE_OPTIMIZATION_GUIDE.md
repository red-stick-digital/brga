# Image Optimization Guide for Baton Rouge GA

## Overview

Based on PageSpeed Insights analysis (Oct 23, 2025), the site can save **~13.3 MB** by optimizing images. This guide provides a step-by-step plan to convert images to WebP format using Photoshop and update all code references.

## Current Image Analysis

### Large Images Requiring Optimization

| Filename                                 | Current Size | Format | Recommended Action                |
| ---------------------------------------- | ------------ | ------ | --------------------------------- |
| `help for gambling circle meeting.png`   | 7.4 MB       | PNG    | Convert to WebP, max width 1920px |
| `help for gambling looking at phone.png` | 2.2 MB       | PNG    | Convert to WebP, max width 1920px |
| `help for gambling next step.png`        | 1.1 MB       | PNG    | Convert to WebP, max width 1920px |
| `help for gambling sunrise.png`          | 3.2 MB       | PNG    | Convert to WebP, max width 1920px |
| `home bonsai.png`                        | 2.9 MB       | PNG    | Convert to WebP, max width 1920px |
| `home head down.png`                     | 2.7 MB       | PNG    | Convert to WebP, max width 1920px |
| `home slot machine.png`                  | 2.6 MB       | PNG    | Convert to WebP, max width 1920px |
| `home three rocks.png`                   | 653 KB       | PNG    | Convert to WebP, max width 1920px |
| `home walking on rocks.png`              | 3.2 MB       | PNG    | Convert to WebP, max width 1920px |
| `Home Hand Up.png`                       | 1.1 MB       | PNG    | Convert to WebP, max width 1920px |
| `contact jumping in the sun.png`         | 703 KB       | PNG    | Convert to WebP, max width 1920px |
| `logo-white.png`                         | 101 KB       | PNG    | Convert to WebP, keep dimensions  |
| `Facebook_Logo_Primary.png`              | 53 KB        | PNG    | Convert to WebP, keep dimensions  |

**Total Original Size: ~27.8 MB**
**Estimated Final Size: ~2-3 MB** (saving ~90%)

### Images to Keep as PNG (Icons/Favicons)

These images should remain as PNG for compatibility:

- `favicon.ico`
- `favicon.svg`
- `favicon-96x96.png`
- `apple-touch-icon.png`
- `web-app-manifest-192x192.png`
- `web-app-manifest-512x512.png`

## Photoshop Conversion Steps

### For Each Large Image (Hero/Content Images):

1. **Open the PNG file** in Photoshop
2. **Resize if needed:**
   - Image → Image Size
   - Set width to **1920px maximum** (maintain aspect ratio)
   - Resolution: 72 DPI (web standard)
3. **Export as WebP:**
   - File → Export → Export As...
   - Format: **WebP**
   - Quality: **80-85%** (good balance of quality/size)
   - Click Export
4. **Save with new extension:** `filename.webp` (remove `.png`)

### For Logo/Small Graphics:

1. **Open the PNG file** in Photoshop
2. **Keep original dimensions** (don't resize)
3. **Export as WebP:**
   - File → Export → Export As...
   - Format: **WebP**
   - Quality: **85-90%** (higher quality for logos)
   - Click Export
4. **Save with new extension:** `filename.webp`

### Batch Processing Option:

If you want to process multiple images at once:

1. File → Scripts → Image Processor
2. Select the `/public/images/` folder
3. Choose WebP as output format
4. Set quality to 80-85%
5. Run the script

## Code Updates Required

After converting images to WebP, update the following files:

### 1. `/src/pages/Home.jsx` (10 references)

```jsx
// Line 37 - Structured data
"logo": "https://batonrougega.org/images/logo-white.webp",

// Line 62 - Hero background
backgroundImage: 'url(/images/Home%20Hand%20Up.webp)',

// Line 129
src="/images/home three rocks.webp"

// Line 146
src="/images/home bonsai.webp"

// Line 169
src="/images/home head down.webp"

// Line 192
src="/images/home slot machine.webp"

// Line 215
src="/images/home walking on rocks.webp"

// Line 296
src="/images/Facebook_Logo_Primary.webp"

// Line 313
src="/images/logo-white.webp"
```

### 2. `/src/pages/HelpForGambling.jsx` (4 references)

```jsx
// Line 122
src = "/images/help for gambling circle meeting.webp";

// Line 138
src = "/images/help for gambling looking at phone.webp";

// Line 182
src = "/images/help for gambling next step.webp";

// Line 299
src = "/images/help for gambling sunrise.webp";
```

### 3. `/src/pages/ContactUs.jsx` (1 reference)

```jsx
// Line 136
backgroundImage: 'url(/images/contact%20jumping%20in%20the%20sun.webp)',
```

### 4. `/src/pages/TwelveStepsAndUnityProgram.jsx` (1 reference)

```jsx
// Line 45
"url": "https://batonrougega.org/images/logo-white.webp"
```

### 5. `/src/components/common/SEO.jsx` (Optional)

The default Open Graph image can stay as PNG since it's already optimized for social media.

## Implementation Checklist

- [ ] **Backup original images** (create `/public/images-backup/` folder)
- [ ] **Convert hero/large images** to WebP (1920px max width, 80-85% quality)
- [ ] **Convert logos/small graphics** to WebP (original size, 85-90% quality)
- [ ] **Delete original PNG files** (keep backup folder)
- [ ] **Update Home.jsx** (10 image references)
- [ ] **Update HelpForGambling.jsx** (4 image references)
- [ ] **Update ContactUs.jsx** (1 image reference)
- [ ] **Update TwelveStepsAndUnityProgram.jsx** (1 image reference)
- [ ] **Test all pages** locally to verify images load correctly
- [ ] **Run dev server** and visually check all images
- [ ] **Test on mobile** to verify responsive behavior
- [ ] **Deploy to production**
- [ ] **Re-run PageSpeed Insights** to verify improvements

## Expected Results

After optimization, you should see:

### Performance Improvements:

- **~25 MB reduction** in total page weight
- **Faster LCP** (Largest Contentful Paint) - currently 9.8s
- **Better Performance Score** - currently 63, target 80+
- **Reduced mobile data usage** for users

### PageSpeed Metrics:

- Images will no longer appear in "Improve image delivery" warnings
- Significant reduction in "Avoid enormous network payloads" warning
- Improved Core Web Vitals scores

## Browser Support

WebP is supported by:

- ✅ Chrome 23+ (2012)
- ✅ Firefox 65+ (2019)
- ✅ Safari 14+ (2020)
- ✅ Edge 18+ (2018)
- ✅ Opera 12.1+ (2012)

Coverage: **~97%** of all browsers globally

## Fallback Strategy (Optional)

If you want to provide fallbacks for older browsers, use the `<picture>` element:

```jsx
<picture>
  <source srcSet="/images/home bonsai.webp" type="image/webp" />
  <img src="/images/home bonsai.png" alt="Bonsai tree" />
</picture>
```

However, given the high WebP support, this is likely unnecessary for most users.

## Post-Deployment Verification

After deploying:

1. **Run PageSpeed Insights**: https://pagespeed.web.dev/
2. **Check these metrics:**
   - Performance Score should be 80+
   - LCP should be under 2.5s
   - Total page size should be under 3 MB
3. **Verify image quality** - images should look sharp and clear
4. **Test on multiple devices** - desktop, mobile, tablet

## Questions?

If you encounter any issues during conversion or notice quality problems:

- Try adjusting WebP quality (85-90% for better quality)
- Ensure proper resize dimensions (1920px max for large images)
- Check that all file references are updated correctly

---

**Estimated Time to Complete:** 30-45 minutes
**Impact:** High - Will significantly improve site performance
**Priority:** High - Currently failing Core Web Vitals
