import { readFileSync, writeFileSync } from 'fs';

const path = 'public/favicon.svg';
let svg = readFileSync(path, 'utf8');

// Insert a dark rounded-square background rect after the opening <svg> tag
svg = svg.replace(/(<svg[^>]*>)/, '$1<rect width="288" height="288" fill="#0d0d0c" rx="56"/>');

writeFileSync(path, svg);
console.log('favicon.svg updated with dark background rect');
