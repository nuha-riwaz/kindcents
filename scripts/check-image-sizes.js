import fs from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const assetsDir = join(projectRoot, 'src', 'assets');

console.log('\n📊 Image File Sizes in src/assets:\n');
console.log('═══════════════════════════════════════════════════════');

const files = fs.readdirSync(assetsDir)
    .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
    .map(file => {
        const filePath = join(assetsDir, file);
        const stats = fs.statSync(filePath);
        return {
            name: file,
            size: stats.size,
            sizeKB: (stats.size / 1024).toFixed(2)
        };
    })
    .sort((a, b) => b.size - a.size);

let totalSize = 0;
files.forEach(file => {
    console.log(`${file.name.padEnd(30)} ${file.sizeKB.padStart(10)} KB`);
    totalSize += file.size;
});

console.log('═══════════════════════════════════════════════════════');
console.log(`Total: ${files.length} files, ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log('═══════════════════════════════════════════════════════\n');
