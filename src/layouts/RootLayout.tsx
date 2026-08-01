import type { ReactNode } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { TopographicBackground } from '../components/canvas/TopographicBackground';
import { CustomCursor } from '../components/ui/CustomCursor';

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopographicBackground />
      <CustomCursor />
      <div className="top-viewport-blur" aria-hidden="true" />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </>
  );
}
