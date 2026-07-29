import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Clock, Mail } from 'lucide-react';
import { navigation } from '../../data/navigation';
import { socials } from '../../data/socials';
import { profile } from '../../data/profile';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const [time, setTime] = useState('');

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setTime(`${now.toLocaleTimeString('en-US', options)} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[var(--z-modal)] bg-black/70 backdrop-blur-md"
          />

          {/* Right Slide Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-[var(--z-modal)] w-full max-w-md bg-[var(--color-surface-1)] border-l border-[var(--color-border-strong)] flex flex-col justify-between p-8 sm:p-12 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between gap-4">
              <span className="type-xs font-mono text-[var(--color-accent)] font-bold">
                NAVIGATION
              </span>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase surface hover:border-[var(--color-border-strong)] rounded-full transition-all"
                aria-label="Close menu"
              >
                MENU <X size={14} />
              </button>
            </div>

            {/* Oversized Menu Links */}
            <nav className="flex flex-col gap-4 my-8">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                >
                  <NavLink
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center justify-between type-display text-4xl sm:text-5xl font-bold transition-all duration-300 ${
                        isActive
                          ? 'text-[var(--color-accent)] translate-x-2'
                          : 'text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:translate-x-2'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight size={24} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-accent)]" />
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Drawer Footer Info & Direct Inquiry */}
            <div className="flex flex-col gap-6 pt-6 border-t border-[var(--color-border)]">
              {/* Clock */}
              <div className="flex items-center gap-2 type-xs text-[var(--color-text-muted)]">
                <Clock size={12} className="text-[var(--color-accent)]" />
                <span>NEW DELHI — {time}</span>
              </div>

              {/* Inquiry */}
              <div className="flex flex-col gap-1">
                <span className="type-xs text-[var(--color-accent)]">DIRECT INQUIRY</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 type-sm font-mono text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <Mail size={14} /> {profile.email}
                </a>
              </div>

              {/* Socials Grid */}
              <div className="flex flex-col gap-2">
                <span className="type-xs text-[var(--color-accent)]">SOCIALS</span>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Action pill */}
              <Link
                to="/about"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-mono font-bold tracking-widest uppercase surface hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] rounded-full transition-all text-center"
              >
                ✦ SOFTWARE ARCHITECT SIGNATURE
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
