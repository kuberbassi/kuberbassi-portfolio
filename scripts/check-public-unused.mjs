import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const srcDir = path.resolve('src');
const indexHtml = path.resolve('index.html');
const public404 = path.resolve('public/404.html');

const allPublicFiles = [];

function getPublicFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      getPublicFiles(full);
    } else {
      allPublicFiles.push(full);
    }
  }
}
getPublicFiles(publicDir);

// Read all code content into memory
function getAllCodeText() {
  let text = fs.readFileSync(indexHtml, 'utf8') + '\n' + fs.readFileSync(public404, 'utf8');
  function readSrc(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) readSrc(full);
      else text += '\n' + fs.readFileSync(full, 'utf8');
    }
  }
  readSrc(srcDir);
  return text;
}

const codeText = getAllCodeText();

console.log('Total public files:', allPublicFiles.length);
const unusedPublic = [];

// Standard web files that browsers fetch automatically
const systemPublic = [
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'manifest.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'og-image.jpg',
  'og-image.png',
  '404.html',
  '.well-known/security.txt',
  'songs.json'
];

for (const pf of allPublicFiles) {
  const rel = path.relative(publicDir, pf).replace(/\\/g, '/');
  if (systemPublic.includes(rel)) continue;

  const fileName = path.basename(pf);
  if (!codeText.includes(fileName) && !codeText.includes(rel)) {
    unusedPublic.push(rel);
  }
}

console.log('Unused public files count:', unusedPublic.length);
console.log('\nUnused public files:');
unusedPublic.forEach(f => console.log(' - public/' + f));
