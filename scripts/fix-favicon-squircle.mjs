/**
 * fix-favicon-squircle.mjs
 * 
 * 1. Changes the favicon.svg viewBox to a SQUARE (centers the logo)
 * 2. Replaces the background rect with a squircle (22.5% corner radius — iOS/ChatGPT style)
 *    positioned to fill the new square viewBox, making corners visible in the browser tab
 */
import { readFileSync, writeFileSync } from 'fs';

const path = 'public/favicon.svg';
let svg = readFileSync(path, 'utf8');

// After our crop, content bounds:
const contentX = 83.140, contentY = 46.910;
const contentW = 123.981, contentH = 176.181;

// Make a square by adding equal horizontal padding so logo is centred
const squareSide = contentH; // 176.181
const extraH = (squareSide - contentW) / 2; // ~26.1
const squareX = contentX - extraH; // shift left
const squareY = contentY;

// New square viewBox
const vbStr = `${squareX.toFixed(3)} ${squareY.toFixed(3)} ${squareSide.toFixed(3)} ${squareSide.toFixed(3)}`;

// Squircle corner radius: 22.5% of side — matches ChatGPT / iOS icon style
const rx = (squareSide * 0.225).toFixed(3);

// Background rect that covers exactly the square viewBox with squircle rx
const bgRect = `<rect x="${squareX.toFixed(3)}" y="${squareY.toFixed(3)}" width="${squareSide.toFixed(3)}" height="${squareSide.toFixed(3)}" fill="#0d0d0c" rx="${rx}"/>`;

// Update viewBox to square
svg = svg.replace(/viewBox="[^"]*"/, `viewBox="${vbStr}"`);

// Replace the existing background rect or insert if not present
if (svg.includes('fill="#0d0d0c"')) {
  svg = svg.replace(/<rect[^>]*fill="#0d0d0c"[^>]*\/>/, bgRect);
} else {
  svg = svg.replace(/(<svg[^>]*>)/, `$1${bgRect}`);
}

writeFileSync(path, svg);

console.log('✓ favicon.svg updated');
console.log('  New viewBox (square):', vbStr);
console.log('  Background squircle rx:', rx);
