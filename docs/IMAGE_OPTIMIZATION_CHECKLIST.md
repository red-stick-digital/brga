# Image Optimization Workflow Checklist

Use this checklist to track your progress through the image optimization process.

## Phase 1: Preparation

- [ ] Read the complete `IMAGE_OPTIMIZATION_GUIDE.md`
- [ ] Create backup folder: `mkdir public/images-backup`
- [ ] Copy all images to backup: `cp public/images/*.png public/images-backup/`
- [ ] Verify backup was successful: `ls -lh public/images-backup/`

## Phase 2: Image Conversion in Photoshop

### Hero/Large Images (1920px max width, 80-85% quality)

- [ ] `Home Hand Up.png` → `Home Hand Up.webp` (1.1 MB)
- [ ] `contact jumping in the sun.png` → `contact jumping in the sun.webp` (703 KB)
- [ ] `help for gambling circle meeting.png` → `help for gambling circle meeting.webp` (7.4 MB)
- [ ] `help for gambling looking at phone.png` → `help for gambling looking at phone.webp` (2.2 MB)
- [ ] `help for gambling next step.png` → `help for gambling next step.webp` (1.1 MB)
- [ ] `help for gambling sunrise.png` → `help for gambling sunrise.webp` (3.2 MB)
- [ ] `home bonsai.png` → `home bonsai.webp` (2.9 MB)
- [ ] `home head down.png` → `home head down.webp` (2.7 MB)
- [ ] `home slot machine.png` → `home slot machine.webp` (2.6 MB)
- [ ] `home three rocks.png` → `home three rocks.webp` (653 KB)
- [ ] `home walking on rocks.png` → `home walking on rocks.webp` (3.2 MB)

### Logos/Small Graphics (original size, 85-90% quality)

- [ ] `logo-white.png` → `logo-white.webp` (101 KB)
- [ ] `Facebook_Logo_Primary.png` → `Facebook_Logo_Primary.webp` (53 KB)

## Phase 3: File Management

- [ ] Move all converted .webp files to `public/images/`
- [ ] Verify all .webp files exist: `ls -lh public/images/*.webp`
- [ ] Delete original .png files (keep backup folder)
- [ ] Check total size reduction: `du -sh public/images/`

## Phase 4: Code Updates

### Option A: Automatic (using script)

- [ ] Run: `./scripts/update-image-references.sh`
- [ ] Review changes: `git diff src/pages/`
- [ ] Verify all references updated correctly

### Option B: Manual (if script has issues)

- [ ] Update `src/pages/Home.jsx` (10 references)

  - [ ] Line 37: logo-white.png → .webp
  - [ ] Line 62: Home Hand Up.png → .webp
  - [ ] Line 129: home three rocks.png → .webp
  - [ ] Line 146: home bonsai.png → .webp
  - [ ] Line 169: home head down.png → .webp
  - [ ] Line 192: home slot machine.png → .webp
  - [ ] Line 215: home walking on rocks.png → .webp
  - [ ] Line 296: Facebook_Logo_Primary.png → .webp
  - [ ] Line 313: logo-white.png → .webp

- [ ] Update `src/pages/HelpForGambling.jsx` (4 references)

  - [ ] Line 122: help for gambling circle meeting.png → .webp
  - [ ] Line 138: help for gambling looking at phone.png → .webp
  - [ ] Line 182: help for gambling next step.png → .webp
  - [ ] Line 299: help for gambling sunrise.png → .webp

- [ ] Update `src/pages/ContactUs.jsx` (1 reference)

  - [ ] Line 136: contact jumping in the sun.png → .webp

- [ ] Update `src/pages/TwelveStepsAndUnityProgram.jsx` (1 reference)
  - [ ] Line 45: logo-white.png → .webp

## Phase 5: Local Testing

- [ ] Start dev server: `npm run dev`
- [ ] Test Home page - verify all images load
  - [ ] Hero image (Home Hand Up)
  - [ ] Three rocks image
  - [ ] Bonsai image
  - [ ] Head down image
  - [ ] Slot machine image
  - [ ] Walking on rocks image
  - [ ] Facebook logo
  - [ ] White logo (footer)
- [ ] Test Help for Gambling page - verify all images load
  - [ ] Circle meeting image
  - [ ] Looking at phone image
  - [ ] Next step image
  - [ ] Sunrise image
- [ ] Test Contact page - verify hero image loads
- [ ] Test Twelve Steps page - verify logo loads
- [ ] Check browser console for any 404 errors
- [ ] Verify images look sharp and clear (no quality loss)

## Phase 6: Cross-Browser Testing

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile device (iOS)
- [ ] Test on mobile device (Android)

## Phase 7: Build and Deploy

- [ ] Build production version: `npm run build`
- [ ] Preview build: `npm run preview`
- [ ] Test production build locally
- [ ] Commit changes: `git add -A && git commit -m "Optimize images: Convert to WebP format"`
- [ ] Push to repository: `git push`
- [ ] Deploy to production
- [ ] Verify deployment successful

## Phase 8: Verification

- [ ] Visit live site: https://batonrougega.org
- [ ] Verify all images load correctly on live site
- [ ] Run PageSpeed Insights: https://pagespeed.web.dev/
- [ ] Check Performance score (target: 80+)
- [ ] Check LCP metric (target: under 2.5s)
- [ ] Verify "Improve image delivery" warning is resolved
- [ ] Check total page size (target: under 3 MB)

## Phase 9: Cleanup

- [ ] Delete .backup files in src/pages/
- [ ] Optionally delete `public/images-backup/` folder (keep for a while first)
- [ ] Update SEO_Optimization_Report.md with new results
- [ ] Document final PageSpeed scores

## Success Metrics

### Before Optimization:

- Performance Score: 63
- LCP: 9.8s
- Total Page Size: ~27.8 MB
- Image Payload: ~27.8 MB

### Target After Optimization:

- Performance Score: 80+
- LCP: < 2.5s
- Total Page Size: < 3 MB
- Image Payload: < 3 MB

### Actual Results (fill in after deployment):

- Performance Score: **\_**
- LCP: **\_**
- Total Page Size: **\_**
- Image Payload: **\_**
- Improvement: **\_**%

---

**Notes:**

- Keep the backup folder for at least a week before deleting
- If you encounter any issues, restore from backup and try again
- Take screenshots of PageSpeed results before and after for comparison
- Update this checklist as you complete each step

**Estimated Total Time:** 45-60 minutes
