/**
 * generate-icons.mjs
 * Uses Sharp to render KuberBassi.svg at various sizes and export PNGs + ICO.
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SVG_PATH = resolve(ROOT, 'public/assets/icons/KuberBassi.svg');
const PUBLIC = resolve(ROOT, 'public');

const svgBuffer = readFileSync(SVG_PATH);

const SIZES = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png',         size: 192 },
  { name: 'icon-512.png',         size: 512 },
];

const ICO_SIZES = [16, 32, 48];

// Minimal ICO file builder — embeds multiple PNG frames
function buildIco(frames) {
  const HEADER_SIZE = 6;
  const DIR_ENTRY_SIZE = 16;
  const headerBuf = Buffer.alloc(HEADER_SIZE);
  headerBuf.writeUInt16LE(0, 0);
  headerBuf.writeUInt16LE(1, 2);
  headerBuf.writeUInt16LE(frames.length, 4);

  let offset = HEADER_SIZE + DIR_ENTRY_SIZE * frames.length;
  const dirEntries = [];
  for (const { size, pngBuffer } of frames) {
    const entry = Buffer.alloc(DIR_ENTRY_SIZE);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(pngBuffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    offset += pngBuffer.length;
  }

  return Buffer.concat([headerBuf, ...dirEntries, ...frames.map(f => f.pngBuffer)]);
}

async function renderAt(size, { bg = '#0d0d0c', padding = 0.1 } = {}) {
  // Parse the bg hex to rgba
  const r = parseInt(bg.slice(1, 3), 16);
  const g = parseInt(bg.slice(3, 5), 16);
  const b = parseInt(bg.slice(5, 7), 16);

  // Inner size with padding
  const inner = Math.round(size * (1 - padding * 2));

  // Render SVG at inner size first
  const svgPng = await sharp(svgBuffer)
    .resize(inner, inner, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  // Composite on dark background
  const pad = Math.round(size * padding);
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r, g, b, alpha: 255 }
    }
  })
    .composite([{ input: svgPng, top: pad, left: pad }])
    .png()
    .toBuffer();
}

(async () => {
  for (const { name, size } of SIZES) {
    console.log(`Rendering ${name} (${size}×${size})…`);
    const buf = await renderAt(size);
    writeFileSync(resolve(PUBLIC, name), buf);
    console.log(`  ✓ Saved public/${name}  (${buf.length} bytes)`);
  }

  console.log('Building favicon.ico…');
  const icoFrames = [];
  for (const s of ICO_SIZES) {
    console.log(`  Rendering ${s}×${s} for ICO…`);
    const buf = await renderAt(s);
    icoFrames.push({ size: s, pngBuffer: buf });
  }
  const icoBuf = buildIco(icoFrames);
  writeFileSync(resolve(PUBLIC, 'favicon.ico'), icoBuf);
  console.log(`  ✓ Saved public/favicon.ico  (${icoBuf.length} bytes)`);

  console.log('\nAll icons generated successfully!');
})();
