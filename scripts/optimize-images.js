#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts PNG images to WebP format and optimizes them for web use
 * 
 * Requirements: npm install sharp
 * 
 * Usage: node scripts/optimize-images.js
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const IMAGE_DIR = path.join(__dirname, '../public/images');
const BACKUP_DIR = path.join(__dirname, '../public/images-backup');

// Quality settings
const WEBP_QUALITY = 85; // Good balance between quality and file size
const LARGE_IMAGE_MAX_WIDTH = 1920; // Max width for large images
const THUMBNAIL_MAX_WIDTH = 400; // For smaller images

// Images to skip (already optimized or need to stay as PNG)
const SKIP_FILES = [
    'favicon.ico',
    'favicon.svg',
    'favicon-96x96.png',
    'apple-touch-icon.png',
    'web-app-manifest-192x192.png',
    'web-app-manifest-512x512.png',
    'site.webmanifest'
];

async function ensureDir(dir) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

async function getImageFiles() {
    const files = await fs.readdir(IMAGE_DIR);
    return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return (ext === '.png' || ext === '.jpg' || ext === '.jpeg') &&
            !SKIP_FILES.includes(file);
    });
}

async function getImageSize(filePath) {
    const stats = await fs.stat(filePath);
    return stats.size;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function optimizeImage(filename) {
    const inputPath = path.join(IMAGE_DIR, filename);
    const outputFilename = filename.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(IMAGE_DIR, outputFilename);
    const backupPath = path.join(BACKUP_DIR, filename);

    try {
        // Get original size
        const originalSize = await getImageSize(inputPath);

        // Get image metadata
        const metadata = await sharp(inputPath).metadata();

        // Determine if this is a large hero image or a smaller one
        const maxWidth = metadata.width > 1200 ? LARGE_IMAGE_MAX_WIDTH : THUMBNAIL_MAX_WIDTH;

        // Backup original
        await ensureDir(BACKUP_DIR);
        await fs.copyFile(inputPath, backupPath);

        // Convert and optimize
        await sharp(inputPath)
            .resize(maxWidth, null, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: WEBP_QUALITY })
            .toFile(outputPath);

        // Get new size
        const optimizedSize = await getImageSize(outputPath);
        const savings = originalSize - optimizedSize;
        const savingsPercent = Math.round((savings / originalSize) * 100);

        console.log(`✓ ${filename} → ${outputFilename}`);
        console.log(`  Original: ${formatBytes(originalSize)} → Optimized: ${formatBytes(optimizedSize)}`);
        console.log(`  Savings: ${formatBytes(savings)} (${savingsPercent}%)`);
        console.log(`  Dimensions: ${metadata.width}x${metadata.height} → max ${maxWidth}px wide`);
        console.log();

        return {
            original: filename,
            optimized: outputFilename,
            originalSize,
            optimizedSize,
            savings
        };
    } catch (error) {
        console.error(`✗ Error optimizing ${filename}:`, error.message);
        return null;
    }
}

async function updateImageReferences(results) {
    const replacements = results
        .filter(r => r !== null)
        .map(r => ({
            from: r.original,
            to: r.optimized
        }));

    console.log('\n📝 Image reference updates needed:');
    console.log('The following files need to be updated in your source code:\n');

    replacements.forEach(({ from, to }) => {
        console.log(`  ${from} → ${to}`);
    });

    console.log('\n⚠️  You will need to update image references in your JSX files.');
    console.log('Common locations: src/pages/*.jsx, src/components/**/*.jsx');
    console.log('\nExample:');
    console.log('  Before: <img src="/images/home bonsai.png" />');
    console.log('  After:  <img src="/images/home bonsai.webp" />');
}

async function main() {
    console.log('🖼️  Image Optimization Script');
    console.log('================================\n');

    try {
        const imageFiles = await getImageFiles();

        if (imageFiles.length === 0) {
            console.log('No images found to optimize.');
            return;
        }

        console.log(`Found ${imageFiles.length} images to optimize\n`);

        const results = [];
        for (const file of imageFiles) {
            const result = await optimizeImage(file);
            if (result) {
                results.push(result);
            }
        }

        // Calculate totals
        const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
        const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
        const totalSavings = totalOriginal - totalOptimized;
        const totalSavingsPercent = Math.round((totalSavings / totalOriginal) * 100);

        console.log('================================');
        console.log('📊 Summary');
        console.log('================================');
        console.log(`Total original size: ${formatBytes(totalOriginal)}`);
        console.log(`Total optimized size: ${formatBytes(totalOptimized)}`);
        console.log(`Total savings: ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`);
        console.log();

        await updateImageReferences(results);

        console.log('\n✅ Optimization complete!');
        console.log(`\n💾 Original images backed up to: ${BACKUP_DIR}`);
        console.log('\n⚠️  Next steps:');
        console.log('1. Review the optimized images in /public/images/');
        console.log('2. Update image references in your JSX files (see list above)');
        console.log('3. Test the site to ensure all images load correctly');
        console.log('4. Delete the backup folder once satisfied with results');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
