import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../lib/motion';
import { Footer } from '../components/layout/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

/** Wraps every page with a page transition animation and proper nav offset. */
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative flex flex-col min-h-screen"
    >
      {/* Subtle noise grain texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[calc(var(--z-overlay)-1)] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px',
        }}
      />
      {/* Main content — offset by precise nav height */}
      <main
        className="flex-1"
        style={{ paddingTop: 'var(--nav-height)' }}
      >
        {children}
      </main>
      <Footer />
    </motion.div>
  );
}

