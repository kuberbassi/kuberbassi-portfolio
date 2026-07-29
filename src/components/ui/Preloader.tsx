import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Disable scroll during preloader
    document.body.style.overflow = 'hidden';

    let start = 0;
    const duration = 1200;
    const intervalTime = 16;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= 100) {
        setCount(100);
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }, 300);
      } else {
        setCount(Math.floor(start));
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[var(--z-toast)] bg-[#040404] text-[var(--color-text-primary)] flex flex-col justify-between p-8 sm:p-16 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="font-display font-extrabold text-lg tracking-tighter uppercase">
              KUBER BASSI<span className="text-[var(--color-accent)]">®</span>
            </span>
            <span className="type-xs font-mono text-[var(--color-text-muted)]">
              INIT SEQUENCE 2026
            </span>
          </div>

          {/* Center Counter */}
          <div className="flex flex-col items-center justify-center gap-2 text-center my-auto">
            <span
              className="font-display font-extrabold text-7xl sm:text-9xl text-gradient tracking-tighter select-none"
              style={{ lineHeight: 1 }}
            >
              {String(count).padStart(2, '0')}%
            </span>
            <span className="type-xs font-mono tracking-widest text-[var(--color-accent)] uppercase">
              INITIALIZING WEBGL SHADERS & ACOUSTICS
            </span>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between type-xs font-mono text-[var(--color-text-muted)]">
            <span>NEW DELHI — IST</span>
            <span>SYSTEM READY</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
