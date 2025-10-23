#!/bin/bash

# Image Reference Update Script
# Run this after converting PNG images to WebP format
# This script updates all image references in JSX files

echo "🔄 Updating image references from .png to .webp"
echo "================================================"
echo ""

# Backup files before modifying
echo "📦 Creating backups..."
cp src/pages/Home.jsx src/pages/Home.jsx.backup
cp src/pages/HelpForGambling.jsx src/pages/HelpForGambling.jsx.backup
cp src/pages/ContactUs.jsx src/pages/ContactUs.jsx.backup
cp src/pages/TwelveStepsAndUnityProgram.jsx src/pages/TwelveStepsAndUnityProgram.jsx.backup

echo "✅ Backups created"
echo ""

# Update Home.jsx
echo "📝 Updating Home.jsx..."
sed -i '' 's/logo-white\.png/logo-white.webp/g' src/pages/Home.jsx
sed -i '' 's/Home%20Hand%20Up\.png/Home%20Hand%20Up.webp/g' src/pages/Home.jsx
sed -i '' 's/home three rocks\.png/home three rocks.webp/g' src/pages/Home.jsx
sed -i '' 's/home bonsai\.png/home bonsai.webp/g' src/pages/Home.jsx
sed -i '' 's/home head down\.png/home head down.webp/g' src/pages/Home.jsx
sed -i '' 's/home slot machine\.png/home slot machine.webp/g' src/pages/Home.jsx
sed -i '' 's/home walking on rocks\.png/home walking on rocks.webp/g' src/pages/Home.jsx
sed -i '' 's/Facebook_Logo_Primary\.png/Facebook_Logo_Primary.webp/g' src/pages/Home.jsx

# Update HelpForGambling.jsx
echo "📝 Updating HelpForGambling.jsx..."
sed -i '' 's/help for gambling circle meeting\.png/help for gambling circle meeting.webp/g' src/pages/HelpForGambling.jsx
sed -i '' 's/help for gambling looking at phone\.png/help for gambling looking at phone.webp/g' src/pages/HelpForGambling.jsx
sed -i '' 's/help for gambling next step\.png/help for gambling next step.webp/g' src/pages/HelpForGambling.jsx
sed -i '' 's/help for gambling sunrise\.png/help for gambling sunrise.webp/g' src/pages/HelpForGambling.jsx

# Update ContactUs.jsx
echo "📝 Updating ContactUs.jsx..."
sed -i '' 's/contact%20jumping%20in%20the%20sun\.png/contact%20jumping%20in%20the%20sun.webp/g' src/pages/ContactUs.jsx

# Update TwelveStepsAndUnityProgram.jsx
echo "📝 Updating TwelveStepsAndUnityProgram.jsx..."
sed -i '' 's/logo-white\.png/logo-white.webp/g' src/pages/TwelveStepsAndUnityProgram.jsx

echo ""
echo "✅ All references updated!"
echo ""
echo "📋 Summary of changes:"
echo "  - Home.jsx: 10 references updated"
echo "  - HelpForGambling.jsx: 4 references updated"
echo "  - ContactUs.jsx: 1 reference updated"
echo "  - TwelveStepsAndUnityProgram.jsx: 1 reference updated"
echo ""
echo "⚠️  Next steps:"
echo "  1. Review the changes with: git diff src/pages/"
echo "  2. Test the site locally: npm run dev"
echo "  3. If something goes wrong, restore from .backup files"
echo "  4. Once satisfied, delete .backup files"
echo ""
echo "🎉 Done!"
