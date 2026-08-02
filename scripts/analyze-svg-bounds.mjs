/**
 * analyze-svg-bounds.mjs
 * Uses sharp to find the actual pixel bounding box of the logo content
 * so we can determine how much empty space exists in the SVG.
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';

const svgBuf = readFileSync('public/assets/icons/KuberBassi.svg');

// Render at high-res to measure content bounds
const size = 512;
const { data, info } = await sharp(svgBuf)
  .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

let minX = width, maxX = 0, minY = height, maxY = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * channels;
    const alpha = data[idx + 3]; // alpha channel
    if (alpha > 10) { // threshold for non-transparent pixels
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`Canvas size: ${width}×${height}`);
console.log(`Content bounds: x=${minX}..${maxX}, y=${minY}..${maxY}`);
console.log(`Content size: ${maxX - minX + 1}×${maxY - minY + 1}`);
console.log(`\nEmpty padding:`);
console.log(`  Top:    ${minY}px  (${((minY/height)*100).toFixed(1)}%)`);
console.log(`  Bottom: ${height - maxY - 1}px  (${(((height - maxY - 1)/height)*100).toFixed(1)}%)`);
console.log(`  Left:   ${minX}px  (${((minX/width)*100).toFixed(1)}%)`);
console.log(`  Right:  ${width - maxX - 1}px  (${(((width - maxX - 1)/width)*100).toFixed(1)}%)`);

const contentW = maxX - minX + 1;
const contentH = maxY - minY + 1;
console.log(`\nOptimized viewBox (in 288px SVG space):`);
const scale = 288 / size;
const vbX = (minX * scale).toFixed(2);
const vbY = (minY * scale).toFixed(2);
const vbW = (contentW * scale).toFixed(2);
const vbH = (contentH * scale).toFixed(2);
console.log(`  viewBox="${vbX} ${vbY} ${vbW} ${vbH}"`);
console.log(`  (adds ~10% padding: ${(minX/width*100 - 5).toFixed(1)}% available to crop)`);
