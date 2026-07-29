import type { ReactNode } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { CustomCursor } from '../components/ui/CustomCursor';
import { SmoothScrollProvider } from '../components/common/SmoothScrollProvider';
import { TopographicBackground } from '../components/canvas/TopographicBackground';

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <TopographicBackground />
      <div className="top-viewport-blur" aria-hidden="true" />
      <CustomCursor />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </SmoothScrollProvider>
  );
}
