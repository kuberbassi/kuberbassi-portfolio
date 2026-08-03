import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useSoundEngine } from '../../hooks/useSoundEngine';

interface AudioVisualizerProps {
  audioUrl: string;
  title: string;
}

export function AudioVisualizer({ audioUrl, title }: AudioVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const { playClick, playHover } = useSoundEngine();

  const togglePlay = () => {
    playClick();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = 28;

    const renderSpectrum = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / bars - 2;

      for (let i = 0; i < bars; i++) {
        let barHeight = 4;
        if (isPlaying) {
          barHeight = Math.random() * (height * 0.8) + 6;
        }

        const x = i * (barWidth + 2);
        const y = height - barHeight;

        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#34d399');

        ctx.fillStyle = isPlaying ? gradient : 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animFrameRef.current = requestAnimationFrame(renderSpectrum);
    };

    renderSpectrum();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="surface p-6 flex flex-col gap-4 rounded-xl border border-[var(--color-border-strong)] shadow-glow">
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            onMouseEnter={() => playHover(800)}
            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            className="w-12 h-12 rounded-full bg-[var(--color-accent)] text-[var(--color-text-inverse)] flex items-center justify-center hover:scale-105 transition-transform"
            data-cursor={isPlaying ? 'PAUSE' : 'PLAY'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>
          <div>
            <span className="type-xs text-[var(--color-accent)]">AUDIO STUDIO PREVIEW</span>
            <h4 className="type-h4 text-[var(--color-text-primary)]">{title}</h4>
          </div>
        </div>
        <Volume2 size={20} className="text-[var(--color-text-muted)]" />
      </div>

      {/* Spectrum Canvas */}
      <div className="h-14 w-full bg-[var(--color-surface-2)] rounded-lg p-2 flex items-center">
        <canvas
          ref={canvasRef}
          width={360}
          height={40}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
}
