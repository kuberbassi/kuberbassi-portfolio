import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('.');
const dumpDir = path.resolve('dump');

const unusedFiles = [
  // Root unused files
  'ascii-scene.html',
  'KuberBassi.svg',

  // Public unused files & folders
  'public/brands/canva.svg',
  'public/og-image.original.png',
  'public/og-image.png.tmp',
  'public/vite.svg',
  'public/music-portfolio',

  // Src unused components & files
  'src/components/canvas/AsciiArtStage.tsx',
  'src/components/canvas/AsciiTerrain.tsx',
  'src/components/canvas/CanvasHero.tsx',
  'src/components/canvas/EngravingTerrain.tsx',
  'src/components/canvas/Footer3DStage.tsx',
  'src/components/canvas/TopographicTerrain3D.tsx',
  'src/components/cards/FeaturedProjectCard.tsx',
  'src/components/cards/MusicCard.tsx',
  'src/components/cards/ProjectCard.tsx',
  'src/components/common/Container.tsx',
  'src/components/common/Section.tsx',
  'src/components/common/SmoothScrollProvider.tsx',
  'src/components/common/SocialLinks.tsx',
  'src/components/layout/NavDrawer.tsx',
  'src/components/sections/Achievements.tsx',
  'src/components/sections/HorizontalScroll.tsx',
  'src/components/sections/PinnedHorizontalScroll.css',
  'src/components/sections/PinnedHorizontalScroll.tsx',
  'src/components/sections/SkillsMatrix.tsx',
  'src/components/ui/AudioVisualizer.tsx',
  'src/components/ui/Badge.tsx',
  'src/components/ui/Button.tsx',
  'src/components/ui/Divider.tsx',
  'src/components/ui/KineticText.tsx',
  'src/components/ui/Magnetic.tsx',
  'src/components/ui/Preloader.tsx',
  'src/components/ui/ScrollRevealText.tsx',
  'src/components/ui/SectionTitle.tsx',
  'src/components/ui/SoundToggle.tsx',
  'src/components/ui/TiltCard.tsx',

  // Unused data files
  'src/data/navigation.ts',
  'src/data/profile.ts',
  'src/data/projects.ts',
  'src/data/socials.ts',

  // Unused hooks
  'src/hooks/useInView.ts',
  'src/hooks/useMediaQuery.ts',
  'src/hooks/useScrollY.ts',
  'src/hooks/useSoundEngine.ts',

  // Unused layout
  'src/layouts/PageLayout.tsx',

  // Unused libs & utils
  'src/lib/constants.ts',
  'src/lib/motion.ts',
  'src/lib/utils.ts',
  'src/utils/cn.ts',
  'src/utils/formatDate.ts',
  'src/utils/slugify.ts',
];

function moveItem(relPath) {
  const srcPath = path.resolve(projectRoot, relPath);
  const destPath = path.resolve(dumpDir, relPath);

  if (!fs.existsSync(srcPath)) {
    console.log(`- Skipped (not found): ${relPath}`);
    return;
  }

  // Ensure destination parent directory exists
  const destParent = path.dirname(destPath);
  fs.mkdirSync(destParent, { recursive: true });

  const stat = fs.statSync(srcPath);
  if (stat.isDirectory()) {
    fs.cpSync(srcPath, destPath, { recursive: true });
    fs.rmSync(srcPath, { recursive: true, force: true });
  } else {
    fs.cpSync(srcPath, destPath);
    fs.rmSync(srcPath, { force: true });
  }
  console.log(`✓ Moved to dump/: ${relPath}`);
}

console.log('Moving unused files to dump/...\n');
unusedFiles.forEach(moveItem);
console.log('\nAll unused files successfully moved to dump/!');
