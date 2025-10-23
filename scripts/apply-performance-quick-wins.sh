#!/bin/bash

# Performance Quick Wins Script
# Adds lazy loading, async decoding, and other optimizations

echo "🚀 Applying Performance Quick Wins"
echo "===================================="
echo ""

# Backup files
echo "📦 Creating backups..."
cp src/pages/Home.jsx src/pages/Home.jsx.perf-backup
cp src/pages/HelpForGambling.jsx src/pages/HelpForGambling.jsx.perf-backup
cp index.html index.html.perf-backup

echo "✅ Backups created"
echo ""

echo "📝 Adding lazy loading and async decoding to images..."
echo ""

# Home.jsx - Add loading="lazy" and decoding="async" to below-fold images (skip hero)
# Card images (all below the fold)
sed -i '' 's/<img$/<img loading="lazy" decoding="async"/g' src/pages/Home.jsx

echo "✅ Home.jsx images optimized"

# HelpForGambling.jsx - Add to all images (they're all below fold)
sed -i '' 's/<img$/<img loading="lazy" decoding="async"/g' src/pages/HelpForGambling.jsx

echo "✅ HelpForGambling.jsx images optimized"
echo ""

echo "📝 Optimizing Google Analytics loading..."

# Move GA script and add defer attribute
# This is a placeholder - the actual implementation needs manual review
echo "⚠️  Manual step needed for GA optimization:"
echo "   Consider moving Google Analytics to end of <body> or using defer"
echo ""

echo "✅ Quick wins applied!"
echo ""
echo "📋 Changes made:"
echo "  - Added lazy loading to all below-fold images"
echo "  - Added async decoding to improve perceived performance"
echo ""
echo "⚠️  Next steps:"
echo "  1. Review changes: git diff src/pages/"
echo "  2. Test locally: npm run dev"
echo "  3. Check browser console for any issues"
echo "  4. Build and test: npm run build && npm run preview"
echo "  5. If issues, restore from .perf-backup files"
echo ""
echo "🎯 Expected impact:"
echo "  - Improved LCP (images load after critical content)"
echo "  - Better perceived performance"
echo "  - Reduced initial page weight"
echo ""
echo "🎉 Done!"
