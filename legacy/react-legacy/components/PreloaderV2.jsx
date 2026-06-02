import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import '../styles/PreloaderV2.css';

export default function PreloaderV2({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds boot
    const interval = 20;
    let elapsed = 0;
    
    const timer = setInterval(() => {
      elapsed += interval;
      // Exponential ease-out for progress calculation
      const p = Math.min(100, 100 * (1 - Math.pow(1 - elapsed / duration, 3)));
      setProgress(p);
      
      if (elapsed >= duration) {
        clearInterval(timer);
        
        // Cinematic crack open
        const tl = gsap.timeline({ onComplete });
        tl.to(textRef.current, { scale: 1.1, opacity: 0, duration: 0.4, ease: 'power2.in' })
          .to(containerRef.current, { 
            yPercent: -100, 
            duration: 1.2, 
            ease: 'expo.inOut',
            borderRadius: '0 0 50% 50%' // Curves as it flies up
          }, '-=0.1');
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div ref={containerRef} className="v2-preloader">
      <div ref={textRef} className="v2-preloader-content">
        <p className="v2-brand">KUBER BASSI</p>
        <div className="v2-counter">
          <span>{Math.round(progress)}</span>
          <span>%</span>
        </div>
        <p className="v2-status">INITIALIZING WEBGL CORE</p>
      </div>
    </div>
  );
}
