import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import { staggerItem } from '../../lib/motion';
import type { MusicRelease } from '../../types';

interface MusicCardProps {
  release: MusicRelease;
  className?: string;
}

export function MusicCard({ release, className }: MusicCardProps) {
  const primaryUrl = release.spotifyUrl ?? release.appleMusicUrl ?? release.youtubeUrl;

  return (
    <motion.article
      variants={staggerItem}
      className={cn(
        'group surface p-7 sm:p-8 rounded-2xl flex flex-col gap-4 hover:border-[var(--color-border-strong)] transition-all duration-250',
        className
      )}
    >
      {/* Audio preview indicator */}
      {release.audioPreviewUrl && (
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="type-xs">Preview available</span>
        </div>
      )}

      {/* Title */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="type-h4 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors mb-1">
            {release.title}
          </h3>
          <span className="type-xs">{release.releaseDate}</span>
        </div>
        <Badge variant="accent">{release.type}</Badge>
      </div>

      {/* Genre */}
      <p className="type-label">{release.genre}</p>

      {/* Description */}
      {release.description && (
        <p className="type-sm clamp-3">{release.description}</p>
      )}

      {/* Platform links */}
      <div className="flex items-center gap-4 mt-auto pt-2">
        {primaryUrl && (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-[var(--color-accent)] hover:underline"
          >
            <Play size={12} /> Listen
          </a>
        )}
        {release.spotifyUrl && (
          <a
            href={release.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Spotify"
            className="type-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Spotify
          </a>
        )}
        {release.appleMusicUrl && (
          <a
            href={release.appleMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Apple Music"
            className="type-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Apple Music
          </a>
        )}
        {release.youtubeUrl && (
          <a
            href={release.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="type-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors inline-flex items-center gap-1"
          >
            <ExternalLink size={10} /> YT
          </a>
        )}
      </div>
    </motion.article>
  );
}
