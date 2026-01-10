import React, { useState, useEffect } from 'react';
import GlitchCanvas from '../components/GlitchCanvas';
import Preloader from '../components/Preloader';
import MainHeader from '../components/MainHeader';
import DotNav from '../components/DotNav';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import VideosSection from '../components/VideosSection';
import MusicCatalogue from '../components/MusicCatalogue';
import StreamingLinksSection from '../components/StreamingLinksSection';
import StatsSection from '../components/StatsSection';
import NewsletterSection from '../components/NewsletterSection';
import InteractiveDotGrid from '../components/InteractiveDotGrid';
import SocialSidebar from '../components/SocialSidebar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MusicPortfolio = () => {
    // Smart Preloader Logic: Session-based (Per Tab)
    // - New Tab / Closed Tab = Animation Plays
    // - Refresh = Animation Skips
    const [loading, setLoading] = useState(() => {
        return !sessionStorage.getItem('session_active');
    });

    useEffect(() => {
        // Mark session as active immediately
        sessionStorage.setItem('session_active', 'true');

        // Setup Main Content Initial State (Hidden)
        // We do this GSAP set regardless, so we can animate IT in.
        gsap.set('#main-content-wrapper', {
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            willChange: 'transform, opacity, filter'
        });
        gsap.set('#global-ui-layer', { opacity: 0 });

        // IF NOT LOADING (Skipped), trigger entrance immediately
        if (!loading) {
            handleTransitionStart();
        }
    }, [loading]); // Dependency on loading to ensure it runs correctly

    const handleTransitionStart = () => {
        // FLUID PAGE ENTRANCE
        const tl = gsap.timeline();

        // Content
        tl.to('#main-content-wrapper', {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: "power2.out",
            force3D: true, // Hardware acceleration
            delay: 0.2,
            onComplete: () => {
                // Clean up will-change to save memory
                gsap.set('#main-content-wrapper', { clearProps: 'willChange' });
            }
        });

        // UI Fade In (slightly faster/concurrent)
        tl.to('#global-ui-layer', {
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, "<0.3"); // Start shortly after content starts

        // Ensure body is visible
        document.body.style.opacity = 1;
    };

    const handlePreloaderComplete = () => {
        setLoading(false);
    };

    // ScrollTrigger Logic
    useEffect(() => {
        if (loading) return;

        const links = document.querySelectorAll('.dot-link');

        setTimeout(() => {
            const sections = document.querySelectorAll('section[id]');
            ScrollTrigger.getAll().forEach(t => t.kill());

            sections.forEach(section => {
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top 60%',
                    end: 'bottom 40%',
                    onEnter: () => setActive(section.id),
                    onEnterBack: () => setActive(section.id),
                });
            });

            function setActive(sectionId) {
                links.forEach(link => {
                    const linkSection = link.getAttribute('data-section');
                    if (linkSection === sectionId) {
                        link.classList.add('active');
                        link.style.backgroundColor = '#ff0033';
                        link.style.transform = 'scale(1.5)';
                    } else {
                        link.classList.remove('active');
                        link.style.backgroundColor = '#a3a3a3';
                        link.style.transform = 'scale(1)';
                    }
                });
            }

            const firstSection = sections[0];
            if (firstSection) setActive(firstSection.id);
        }, 300);

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };

    }, [loading]);

    // Force visibility fix
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'visibility-fix';
        style.textContent = `
            main { visibility: visible !important; opacity: 1 !important; }
            section { visibility: visible !important; opacity: 1 !important; }
        `;
        document.head.appendChild(style);
        return () => {
            const existingStyle = document.getElementById('visibility-fix');
            if (existingStyle) existingStyle.remove();
        };
    }, []);

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', overflow: 'hidden' }}>

            <GlitchCanvas />
            <InteractiveDotGrid />

            {/* Global Fixed UI Layer - Outside the transform wrapper to stay Sticky */}
            <div id="global-ui-layer" style={{ position: 'relative', zIndex: 100 }}>
                <MainHeader />
                <DotNav />
                <SocialSidebar />
            </div>

            {/* Main Content - Always mounted, initially hidden via GSAP */}
            <div id="main-content-wrapper" style={{ position: 'relative', zIndex: 1 }}>
                <main id="main-container">
                    <HeroSection />
                    <AboutSection />
                    <VideosSection />
                    <MusicCatalogue />
                    <StreamingLinksSection />
                    <StatsSection />
                    <NewsletterSection />
                </main>

                {/* Custom Cursor */}
                <div className="cursor" style={{
                    position: 'fixed', width: '12px', height: '12px', backgroundColor: '#fff', borderRadius: '50%', pointerEvents: 'none', zIndex: 9999, mixBlendMode: 'difference', transform: 'translate(-50%, -50%)', display: 'none'
                }}></div>
            </div>

            {/* Preloader - Overlays everything */}
            {loading && (
                <Preloader
                    onTransitionStart={handleTransitionStart}
                    onComplete={handlePreloaderComplete}
                />
            )}

            <EffectCursor />
        </div>
    );
};

// Sub-component for cursor
const EffectCursor = () => {
    useEffect(() => {
        const cursor = document.querySelector('.cursor');
        if (window.matchMedia("(pointer: fine)").matches && cursor) {
            cursor.style.display = 'block';
            const moveCursor = (e) => {
                gsap.to(cursor, { duration: 0.3, x: e.clientX, y: e.clientY, ease: 'power2.out' });
            };
            window.addEventListener('mousemove', moveCursor);
            return () => window.removeEventListener('mousemove', moveCursor);
        }
    }, []);
    return null;
}

export default MusicPortfolio;
