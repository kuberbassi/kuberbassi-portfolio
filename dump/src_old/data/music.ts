import { MusicRelease, MusicChannel } from '../types';

export const musicChannels: MusicChannel[] = [
  {
    name: 'YouTube Channel',
    desc: 'Performances, guitar covers, and visual studio recordings.',
    url: 'https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw',
    status: 'BROADCASTING',
    tuning: 15,
  },
  {
    name: 'Spotify',
    desc: 'Published releases and official streaming catalog.',
    url: 'https://push.fm/fl/jqjuw3ji',
    status: 'ONLINE',
    tuning: 35,
  },
  {
    name: 'Apple Music',
    desc: 'Lossless audio distribution channel.',
    url: 'https://music.apple.com/in/artist/ku%CE%B2er-%CE%B2%CE%B4ssi/1763841556',
    status: 'ACTIVE',
    tuning: 55,
  },
  {
    name: 'YouTube Music',
    desc: 'Streaming archive & radio discovery.',
    url: 'https://music.youtube.com/channel/UCnom0oKiYYa_PLEUpczvOVQ',
    status: 'TRANSMITTING',
    tuning: 75,
  },
  {
    name: 'Amazon Music',
    desc: 'Global digital distribution channel.',
    url: 'https://music.amazon.in/artists/B0DDQ7M12J',
    status: 'ONLINE',
    tuning: 95,
  },
];

export const musicReleases: MusicRelease[] = [
  {
    id: 'release-1',
    title: 'Codex Over Observatory',
    type: 'Single',
    releaseDate: '2025',
    genre: 'Cinematic Ambient / Electronic',
    description: 'An atmospheric soundscape blending layered electric guitar swell dynamics with synth textures.',
    spotifyUrl: 'https://push.fm/fl/jqjuw3ji',
    appleMusicUrl: 'https://music.apple.com/in/artist/ku%CE%B2er-%CE%B2%CE%B4ssi/1763841556',
    youtubeUrl: 'https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw',
    audioPreviewUrl: '/Codex Over Observatory.mp3',
  },
  {
    id: 'release-2',
    title: 'Resonance Fields',
    type: 'EP',
    releaseDate: '2024',
    genre: 'Post-Rock / Progressive Ambient',
    description: 'An exploration of rhythmic guitar loops, spatial delays, and harmonic signal chains.',
    spotifyUrl: 'https://push.fm/fl/jqjuw3ji',
    youtubeUrl: 'https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw',
  },
];
