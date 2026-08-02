import fs from 'fs';
import path from 'path';

const rootDir = path.resolve('src');
const allFiles = [];

function getFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) getFiles(full);
    else if (/\.(tsx?|jsx?|css)$/.test(e.name)) allFiles.push(full);
  }
}
getFiles(rootDir);

const importedSet = new Set();
const entries = [
  path.resolve('index.html'),
  path.resolve('src/main.tsx'),
  path.resolve('src/styles/globals.css')
];
const visited = new Set();

function trace(filePath) {
  if (!fs.existsSync(filePath) || visited.has(filePath)) return;
  visited.add(filePath);
  importedSet.add(filePath);

  const content = fs.readFileSync(filePath, 'utf8');

  // Match import statements, dynamic imports, require, url(), @import
  const regexes = [
    /(?:import|export)\s+[\s\S]*?from\s+['"]([^'"]+)['"]/g,
    /import\s*\(['"]([^'"]+)['"]\)/g,
    /import\s+['"]([^'"]+)['"]/g,
    /require\(['"]([^'"]+)['"]\)/g,
    /@import\s+['"]([^'"]+)['"]/g,
    /url\(['"]?([^'"]+?)['"]?\)/g
  ];

  for (const regex of regexes) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      let ref = match[1];
      if (ref.startsWith('.')) {
        const dir = path.dirname(filePath);
        let resolved = path.resolve(dir, ref);
        if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
          resolved = path.join(resolved, 'index');
        }
        const exts = ['', '.tsx', '.ts', '.jsx', '.js', '.css', '.svg', '.png', '.jpg', '.webp'];
        for (const ext of exts) {
          if (fs.existsSync(resolved + ext) && !fs.statSync(resolved + ext).isDirectory()) {
            trace(resolved + ext);
            break;
          }
        }
      }
    }
  }
}

entries.forEach(e => trace(e));

console.log('Total src files:', allFiles.length);
console.log('Used src files:', importedSet.size);

const unused = allFiles.filter(f => !importedSet.has(f));
console.log('\nUnused src files:');
unused.forEach(f => console.log(' - ' + path.relative(process.cwd(), f)));
