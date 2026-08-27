import type { MusicRelease, MusicChannel } from '../types';

export const musicChannels: MusicChannel[] = [
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
    name: 'YouTube',
    desc: 'Performances, guitar covers, and visual studio recordings.',
    url: 'https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw',
    status: 'BROADCASTING',
    tuning: 15,
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
    title: 'Supercars',
    type: 'Single',
    releaseDate: '2024',
    genre: 'Electronic / Instrumental',
    description: 'High-energy electronic and driving instrumental production.',
    spotifyUrl: 'https://push.fm/fl/e5ryus8j',
    appleMusicUrl: 'https://music.apple.com/in/artist/ku%CE%B2er-%CE%B2%CE%B4ssi/1763841556',
    youtubeUrl: 'https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw',
  },
  {
    id: 'release-2',
    title: 'Guitar Rush',
    type: 'Single',
    releaseDate: '2024',
    genre: 'Guitar / Instrumental',
    description: 'Melodic guitar performance and energetic instrumental arrangement.',
    spotifyUrl: 'https://push.fm/fl/xxtggbry',
    appleMusicUrl: 'https://music.apple.com/in/artist/ku%CE%B2er-%CE%B2%CE%B4ssi/1763841556',
    youtubeUrl: 'https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw',
  },
];
