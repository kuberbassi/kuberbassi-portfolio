import React, { useState, useEffect } from 'react';
import { useSoundEngine } from '../../hooks/useSoundEngine';

interface KineticTextProps {
  text: string;
  className?: string;
  scrambleOnHover?: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

export function KineticText({ text, className = '', scrambleOnHover = true }: KineticTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const { playHover } = useSoundEngine();

  const handleMouseEnter = () => {
    if (!scrambleOnHover || isScrambling) return;
    setIsScrambling(true);
    playHover(900);

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
      iteration += 1 / 2;
    }, 30);
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      className={`inline-block font-mono tracking-tight transition-colors ${className}`}
    >
      {displayText}
    </span>
  );
}
