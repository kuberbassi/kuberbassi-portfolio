import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModernPortfolio from './pages/ModernPortfolio';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll with premium configuration
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // sleek easeOutExpo curves
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
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ModernPortfolio initialMode="synthesis" />} />
        <Route path="*" element={<ModernPortfolio initialMode="synthesis" />} />
      </Routes>
    </Router>
  );
}

export default App;

