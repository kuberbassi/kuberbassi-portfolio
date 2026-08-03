/* ============================================================
   MOTION — Shared Framer Motion variants
   Reusable animation config objects for consistency.
   ============================================================ */

import type { Variants } from 'framer-motion';

/* ── Page transition ────────────────────────────────────────── */

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
};

/* ── Fade up ────────────────────────────────────────────────── */

export const fadeUpVariants: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
  },
};

/* ── Fade in ────────────────────────────────────────────────── */

export const fadeInVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45 } },
};

/* ── Stagger container ──────────────────────────────────────── */

export const staggerContainer: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

/* ── Stagger item ───────────────────────────────────────────── */

export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

/* ── Scale in ───────────────────────────────────────────────── */

export const scaleInVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },
};

/* ── Slide in from left ─────────────────────────────────────── */

export const slideLeftVariants: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

/* ── Card hover ─────────────────────────────────────────────── */

export const cardHover = {
  rest:  { y: 0,  scale: 1,    transition: { duration: 0.25 } },
  hover: { y: -4, scale: 1.01, transition: { duration: 0.25 } },
};
