/* ============================================================
   TYPES — Centralized TypeScript interfaces
   All shared types in one place. Never duplicate.
   ============================================================ */

/* ── Project ───────────────────────────────────────────────── */

export interface Project {
  title: string;
  slug: string;
  desc: string;
  fullDescription?: string;
  overview?: string;
  problem?: string;
  solution?: string;
  tech: string[];
  language?: string;
  stars?: number;
  img?: string;
  link?: string;
  github?: string;
  projectId?: string;
  version?: string;
  stat: 'LIVE' | 'SOURCE' | 'WIP' | 'ARCHIVED';
  featured: boolean;
  category: 'fullstack' | 'ai' | 'systems' | 'tools' | 'open-source';
  year: string;
}

/* ── Music ─────────────────────────────────────────────────── */

export interface MusicRelease {
  id: string;
  title: string;
  type: 'Single' | 'EP' | 'Album';
  releaseDate: string;
  genre: string;
  description?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  audioPreviewUrl?: string;
}

export interface MusicChannel {
  name: string;
  desc: string;
  url: string;
  status: string;
  tuning?: number;
}

/* ── Profile ───────────────────────────────────────────────── */

export interface Principle {
  title: string;
  text: string;
}

export interface IdentityCard {
  label: string;
  title: string;
  text: string;
}

export interface Skills {
  frontend: string[];
  backend: string[];
  aiAutomation: string[];
  tools: string[];
}

export interface Profile {
  name: string;
  handle: string;
  role: string;
  location: string;
  email: string;
  availability: string;
  intro: string;
  signature: string;
  focusAreas: string[];
  principles: Principle[];
  identityBridge: IdentityCard[];
  skills: Skills;
}

/* ── Experience ────────────────────────────────────────────── */

export interface ExperienceItem {
  id: string;
  title: string;
  role: string;
  period: string;
  organization: string;
  description: string;
  highlights: string[];
}

/* ── Navigation ────────────────────────────────────────────── */

export interface NavItem {
  label: string;
  href: string;
}

/* ── Socials ───────────────────────────────────────────────── */

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

/* ── Common ────────────────────────────────────────────────── */

export type Status = 'LIVE' | 'SOURCE' | 'WIP' | 'ARCHIVED';

export interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
}
