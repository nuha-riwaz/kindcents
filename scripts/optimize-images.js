import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');

// Directories to optimize
const directories = [
    join(projectRoot, 'src', 'assets'),
    join(projectRoot, 'public')
];

async function optimizeImages() {
    const logFile = join(projectRoot, 'optimization-results.txt');
    let logContent = '🖼️  Image Optimization Results\n';
    logContent += '═══════════════════════════════════════════════════════\n\n';

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let filesProcessed = 0;

    for (const dir of directories) {
        if (!fs.existsSync(dir)) {
            logContent += `⚠️  Directory not found: ${dir}\n`;
            continue;
        }

        logContent += `📁 Processing: ${dir}\n`;

        // Store original file sizes
        const originalSizes = {};
        const files = fs.readdirSync(dir).filter(file =>
            /\.(png|jpg|jpeg)$/i.test(file)
        );

        files.forEach(file => {
            const filePath = join(dir, file);
            const stats = fs.statSync(filePath);
            originalSizes[file] = stats.size;
            totalOriginalSize += stats.size;
        });

        // Optimize images
        const result = await imagemin([`${dir}/*.{png,jpg,jpeg}`], {
            destination: dir,
            plugins: [
                imageminPngquant({
                    quality: [0.6, 0.8], // TinyPNG-style compression
                    speed: 1 // Slower but better compression
                }),
                imageminMozjpeg({
                    quality: 80, // High quality JPEG compression
                    progressive: true
                })
            ]
        });

        // Calculate optimized sizes
        result.forEach(file => {
            const fileName = file.sourcePath.split('\\').pop();
            const originalSize = originalSizes[fileName];
            const optimizedSize = file.data.length;

            totalOptimizedSize += optimizedSize;
            filesProcessed++;

            const originalKB = (originalSize / 1024).toFixed(2);
            const optimizedKB = (optimizedSize / 1024).toFixed(2);
            const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

            logContent += `  ✓ ${fileName.padEnd(30)} ${originalKB.padStart(8)} KB → ${optimizedKB.padStart(8)} KB (${savings.padStart(5)}% saved)\n`;
        });

        logContent += '\n';
    }

    // Summary
    const totalSavings = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
    const originalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
    const optimizedMB = (totalOptimizedSize / 1024 / 1024).toFixed(2);
    const savedMB = (originalMB - optimizedMB).toFixed(2);

    logContent += '═══════════════════════════════════════════════════════\n';
    logContent += '✨ Optimization Complete!\n';
    logContent += '═══════════════════════════════════════════════════════\n';
    logContent += `📊 Files processed: ${filesProcessed}\n`;
    logContent += `📦 Original size: ${originalMB} MB\n`;
    logContent += `📦 Optimized size: ${optimizedMB} MB\n`;
    logContent += `💾 Space saved: ${savedMB} MB (${totalSavings}%)\n`;
    logContent += '═══════════════════════════════════════════════════════\n';

    // Write to file
    fs.writeFileSync(logFile, logContent);

    // Also print to console
    console.log(logContent);
    console.log(`\n📄 Full results saved to: optimization-results.txt\n`);
}

optimizeImages().catch(err => {
    console.error('❌ Error optimizing images:', err);
    process.exit(1);
});
