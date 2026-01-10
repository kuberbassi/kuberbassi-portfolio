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
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MusicPortfolio = () => {
    const [loading, setLoading] = useState(false); // TEMPORARILY SET TO FALSE TO DEBUG

    const handlePreloaderComplete = () => {
        setLoading(false);
        // Removed GSAP animation - was causing visibility issues
    };

    // Force visibility on mount - fixes persistent visibility:hidden issue
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'visibility-fix';
        style.textContent = `
            main { visibility: visible !important; opacity: 1 !important; }
            section { visibility: visible !important; opacity: 1 !important; }
            h1, h2, h3, h4, h5, h6, p, div, span { visibility: visible !important; }
        `;
        document.head.appendChild(style);
        return () => {
            const existingStyle = document.getElementById('visibility-fix');
            if (existingStyle) existingStyle.remove();
        };
    }, []);

    useEffect(() => {
        if (loading) return;

        // Setup ScrollTrigger for DotNav active state logic
        const links = document.querySelectorAll('.dot-link');

        // Wait for sections to be rendered
        setTimeout(() => {
            const sections = document.querySelectorAll('section[id]');

            // Clear existing triggers
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

            // Set initial active state
            const firstSection = sections[0];
            if (firstSection) setActive(firstSection.id);
        }, 300);

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };

    }, [loading]);

    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
            {/* Preloader is visible initially */}
            {/* <Preloader onComplete={handlePreloaderComplete} /> */}

            <GlitchCanvas />
            <InteractiveDotGrid />

            {!loading && (
                <>
                    <MainHeader />
                    <DotNav />
                    <main id="main-container">
                        <HeroSection />
                        <AboutSection />
                        <VideosSection />
                        <MusicCatalogue />
                        <StreamingLinksSection />
                        <StatsSection />
                        <NewsletterSection />
                    </main>

                    {/* Custom Cursor Logic could go here or in a wrapper */}
                    <div className="cursor" style={{
                        position: 'fixed', width: '12px', height: '12px', backgroundColor: '#fff', borderRadius: '50%', pointerEvents: 'none', zIndex: 9999, mixBlendMode: 'difference', transform: 'translate(-50%, -50%)', display: 'none' // Hidden by default, enable via JS
                    }}></div>
                </>
            )}

            {/* Simple cursor script effect if needed */}
            <EffectCursor />
        </div>
    );
};

// Sub-component for cursor to keep main clean
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
