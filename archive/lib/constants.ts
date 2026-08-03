/* ============================================================
   CONSTANTS — App-wide constants
   No magic numbers. No magic strings. All values live here.
   ============================================================ */

export const SITE_NAME = 'Kuber Bassi';
export const SITE_URL  = 'https://kuberbassi.com';
export const SITE_ROLE = 'Software Architect & Music Producer';
export const SITE_EMAIL = 'me@kuberbassi.com';
export const GITHUB_USERNAME = 'kuberbassi';

export const NAV_HEIGHT = 72; // px — matches --nav-height CSS var

export const TRANSITION_PAGE = 0.4; // seconds
export const TRANSITION_CARD = 0.25;

export const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
} as const;
