import React from 'react';
import { VolumeX } from 'lucide-react';
import { useSoundEngine } from '../../hooks/useSoundEngine';
import { cn } from '../../utils/cn';

interface SoundToggleProps {
  className?: string;
}

export function SoundToggle({ className }: SoundToggleProps) {
  const { muted, toggleSound, playHover } = useSoundEngine();

  return (
    <button
      onClick={toggleSound}
      onMouseEnter={() => playHover(1000)}
      title={muted ? 'Enable sound' : 'Mute sound'}
      aria-label={muted ? 'Enable sound' : 'Mute sound'}
      className={cn(
        'group flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] surface hover:border-[var(--color-border-strong)] transition-all duration-300',
        !muted && 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]',
        className
      )}
    >
      {muted ? (
        <VolumeX size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors" />
      ) : (
        <div className="flex items-end justify-center gap-0.5 h-3.5 w-3.5">
          <span className="w-0.5 h-full bg-[var(--color-accent)] rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-0.5 h-full bg-[var(--color-accent)] rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-0.5 h-full bg-[var(--color-accent)] rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      )}
    </button>
  );
}
