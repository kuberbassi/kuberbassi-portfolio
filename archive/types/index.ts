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
  stat?: 'LIVE' | 'SOURCE' | 'ARCHIVE';
  featured?: boolean;
  category?: 'fullstack' | 'ai' | 'systems' | 'web3';
  year?: string;
}

export interface MusicRelease {
  id: string;
  title: string;
  type: 'Single' | 'EP' | 'Album';
  cover?: string;
  releaseDate: string;
  genre: string;
  description: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  amazonMusicUrl?: string;
  audioPreviewUrl?: string;
}

export interface MusicChannel {
  name: string;
  desc: string;
  url: string;
  status: string;
  tuning: number;
}

export interface SocialLink {
  label: string;
  href: string;
  icon?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  role: string;
  period: string;
  organization: string;
  description: string;
  highlights: string[];
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
  principles: Array<{ title: string; text: string }>;
  identityBridge: Array<{ label: string; title: string; text: string }>;
  skills: {
    frontend: string[];
    backend: string[];
    aiAutomation: string[];
    tools: string[];
  };
}

export interface NavEntry {
  label: string;
  path: string;
}
