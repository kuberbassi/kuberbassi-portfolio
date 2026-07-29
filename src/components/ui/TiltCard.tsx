import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useSoundEngine } from '../../hooks/useSoundEngine';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  cursorLabel?: string;
}

export function TiltCard({ children, className, cursorLabel = 'EXPLORE' }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });
  const { playHover } = useSoundEngine();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setRotX(rotateX);
    setRotY(rotateY);

    setSpotlight({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseEnter = () => {
    playHover(700);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor={cursorLabel}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: rotX,
        rotateY: rotY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className={cn('relative overflow-hidden surface rounded-lg transition-colors border border-[var(--color-border)] hover:border-[var(--color-border-strong)]', className)}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(400px circle at ${spotlight.x}% ${spotlight.y}%, rgba(16, 185, 129, 0.14), transparent 80%)`,
        }}
      />

      {children}
    </motion.div>
  );
}
