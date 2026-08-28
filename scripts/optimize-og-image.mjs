/**
 * optimize-og-image.mjs
 * Resizes og-image.png to exact 1200×630 and optimizes for fast loading.
 * Outputs both PNG (fallback) and a highly optimized JPEG for OG use.
 */
import sharp from 'sharp';
import { existsSync, renameSync } from 'fs';

const SRC = 'public/og-image.png';
const OUT_PNG = 'public/og-image.png';
const OUT_JPG = 'public/og-image.jpg';

const meta = await sharp(SRC).metadata();
console.log(`Source: ${meta.width}×${meta.height}, ${Math.round((await (await import('fs')).promises.stat(SRC)).size / 1024)}KB`);

// Backup original
if (!existsSync('public/og-image.original.png')) {
  const fs = await import('fs');
  fs.copyFileSync(SRC, 'public/og-image.original.png');
  console.log('✓ Backed up original → og-image.original.png');
}

// Resize to 1200×630 with smart crop focused on center
const pipeline = sharp(SRC)
  .resize(1200, 630, {
    fit: 'cover',
    position: 'attention', // smart crop to keep important content
  });

// Output 1: Optimized PNG (for platforms requiring PNG)
await pipeline.clone()
  .png({ compressionLevel: 9, effort: 10 })
  .toFile('public/og-image.tmp.png');

// Output 2: JPEG (preferred — 5-10x smaller, all platforms accept it)
await pipeline.clone()
  .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(OUT_JPG);

// Swap png temp to actual file
renameSync('public/og-image.tmp.png', OUT_PNG);

const fs = await import('fs');
const pngSize = Math.round(fs.statSync(OUT_PNG).size / 1024);
const jpgSize = Math.round(fs.statSync(OUT_JPG).size / 1024);

console.log(`\n✓ og-image.png  → 1200×630  (${pngSize} KB)`);
console.log(`✓ og-image.jpg  → 1200×630  (${jpgSize} KB)  ← use this for OG tags`);
console.log(`\nFile size reduction: ${Math.round((1 - jpgSize/1481) * 100)}% smaller than original`);
