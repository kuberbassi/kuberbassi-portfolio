/**
 * crop-svg-viewbox.mjs
 * Updates KuberBassi.svg viewBox to tightly crop the logo content
 * with a small padding margin for breathing room.
 */
import { readFileSync, writeFileSync } from 'fs';

// Measured content bounds in 288px SVG space (from analyze-svg-bounds.mjs)
// Raw content: x=91.69, y=59.06, w=106.88, h=151.88
// Add ~8% padding on each side for visual breathing room
const RAW = { x: 91.69, y: 59.06, w: 106.88, h: 151.88 };
const PAD_X = RAW.w * 0.08;
const PAD_Y = RAW.h * 0.08;

const vbX = (RAW.x - PAD_X).toFixed(3);
const vbY = (RAW.y - PAD_Y).toFixed(3);
const vbW = (RAW.w + PAD_X * 2).toFixed(3);
const vbH = (RAW.h + PAD_Y * 2).toFixed(3);

const newViewBox = `${vbX} ${vbY} ${vbW} ${vbH}`;
console.log(`New viewBox: "${newViewBox}"`);

// Update both SVG files
for (const path of [
  'public/assets/icons/KuberBassi.svg',
  'public/favicon.svg',
]) {
  let svg = readFileSync(path, 'utf8');
  // Replace the viewBox attribute
  svg = svg.replace(/viewBox="[^"]*"/, `viewBox="${newViewBox}"`);
  writeFileSync(path, svg);
  console.log(`✓ Updated ${path}`);
}
