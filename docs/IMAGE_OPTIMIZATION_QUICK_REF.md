# Quick Reference: Image Optimization

## Photoshop Export Settings

### Large Images (Hero/Content)

```
File → Export → Export As...
├─ Format: WebP
├─ Quality: 80-85%
├─ Resize: 1920px max width
└─ Resolution: 72 DPI
```

### Small Images (Logos)

```
File → Export → Export As...
├─ Format: WebP
├─ Quality: 85-90%
├─ Resize: Keep original size
└─ Resolution: 72 DPI
```

## File Name Conversions

| Original PNG                             | New WebP                                  |
| ---------------------------------------- | ----------------------------------------- |
| `Home Hand Up.png`                       | `Home Hand Up.webp`                       |
| `contact jumping in the sun.png`         | `contact jumping in the sun.webp`         |
| `help for gambling circle meeting.png`   | `help for gambling circle meeting.webp`   |
| `help for gambling looking at phone.png` | `help for gambling looking at phone.webp` |
| `help for gambling next step.png`        | `help for gambling next step.webp`        |
| `help for gambling sunrise.png`          | `help for gambling sunrise.webp`          |
| `home bonsai.png`                        | `home bonsai.webp`                        |
| `home head down.png`                     | `home head down.webp`                     |
| `home slot machine.png`                  | `home slot machine.webp`                  |
| `home three rocks.png`                   | `home three rocks.webp`                   |
| `home walking on rocks.png`              | `home walking on rocks.webp`              |
| `logo-white.png`                         | `logo-white.webp`                         |
| `Facebook_Logo_Primary.png`              | `Facebook_Logo_Primary.webp`              |

## Quick Commands

```bash
# 1. Backup images
mkdir public/images-backup
cp public/images/*.png public/images-backup/

# 2. After conversion, update code references
./scripts/update-image-references.sh

# 3. Test locally
npm run dev

# 4. Check the changes
git diff src/pages/

# 5. Build and deploy
npm run build
git add -A
git commit -m "Optimize images: Convert to WebP format"
git push
```

## Files That Will Be Updated

- `src/pages/Home.jsx` → 10 image references
- `src/pages/HelpForGambling.jsx` → 4 image references
- `src/pages/ContactUs.jsx` → 1 image reference
- `src/pages/TwelveStepsAndUnityProgram.jsx` → 1 image reference

## Expected Impact

| Metric            | Before   | Target |
| ----------------- | -------- | ------ |
| Performance Score | 63       | 80+    |
| LCP               | 9.8s     | <2.5s  |
| Page Size         | ~27.8 MB | <3 MB  |
| Savings           | -        | ~90%   |
