import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { KineticLatticeCanvas } from '../components/common/KineticLatticeCanvas';

export const RootLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-slate-100 selection:bg-rose-500/25 selection:text-rose-200 relative overflow-x-hidden">
      {/* Background Interactive Kinetic Parallax Canvas */}
      <KineticLatticeCanvas />

      {/* Navbar */}
      <Navbar />

      {/* Main Page Route View */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
