import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const ModernPortfolio = React.lazy(() => import('./pages/ModernPortfolio'));
const MobileLinkBio = React.lazy(() => import('./pages/MobileLinkBio'));
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function PortfolioWrapper() {
  const [isMobile, setIsMobile] = useState(false);
  const [overrideMobile, setOverrideMobile] = useState(() => {
    try {
      return sessionStorage.getItem('overrideMobile') === 'desktop';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleViewDesktop = () => {
    try {
      sessionStorage.setItem('overrideMobile', 'desktop');
    } catch {
      // ignore
    }
    setOverrideMobile(true);
  };

  const handleResetMobile = () => {
    try {
      sessionStorage.removeItem('overrideMobile');
    } catch {
      // ignore
    }
    setOverrideMobile(false);
  };

  const showMobilePortal = isMobile && !overrideMobile;

  useEffect(() => {
    if (showMobilePortal) return;

    // Initialize Lenis smooth scroll optimized for high refresh rates (120Hz/144Hz)
    const lenis = new Lenis({
      lerp: 0.1, // buttery smooth responsive scroll interpolation
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false, // Keep native touch behavior on mobile for best latency
    });

    // Update ScrollTrigger on Lenis scroll updates
    lenis.on('scroll', ScrollTrigger.update);

    // Bind RAF loop through GSAP Ticker for perfect synchronization
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Dynamic anchor interceptor to transition scrolls smoothly
    const handleAnchorClick = (e) => {
      const a = e.target.closest('a');
      if (a) {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(href);
          if (targetEl) {
            lenis.scrollTo(targetEl, { offset: -90, duration: 1.5 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    window.lenis = lenis; // Expose globally if other hooks need control

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
      document.removeEventListener('click', handleAnchorClick);
      delete window.lenis;
    };
  }, [showMobilePortal]);

  if (showMobilePortal) {
    return (
      <React.Suspense fallback={<div style={{ background: '#050407', minHeight: '100vh' }} />}>
        <MobileLinkBio onViewDesktop={handleViewDesktop} />
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={<div style={{ background: '#050407', minHeight: '100vh' }} />}>
      <ModernPortfolio 
        initialMode="synthesis" 
        isMobileOverridden={isMobile && overrideMobile} 
        onResetMobile={handleResetMobile} 
      />
    </React.Suspense>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioWrapper />} />
        <Route path="*" element={<PortfolioWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;

