import fs from 'fs';
import path from 'path';

// 1. Move unused API handlers
const unusedApiFiles = ['api/github.js', 'api/youtube.js'];
for (const rel of unusedApiFiles) {
  const srcPath = path.resolve(rel);
  const destPath = path.resolve('dump', rel);
  if (fs.existsSync(srcPath)) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.renameSync(srcPath, destPath);
    console.log(`✓ Moved to dump/: ${rel}`);
  }
}

// 2. Remove temporary .tmp-logo-render folder if present
const tmpLogoRender = path.resolve('.tmp-logo-render');
if (fs.existsSync(tmpLogoRender)) {
  fs.rmSync(tmpLogoRender, { recursive: true, force: true });
  console.log('✓ Cleaned up .tmp-logo-render temp folder');
}

// 3. Remove empty folders in src/
const srcDirs = ['src/lib', 'src/utils', 'src/components/common'];
for (const rel of srcDirs) {
  const dirPath = path.resolve(rel);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    if (files.length === 0) {
      fs.rmdirSync(dirPath);
      console.log(`✓ Removed empty directory: ${rel}`);
    }
  }
}
