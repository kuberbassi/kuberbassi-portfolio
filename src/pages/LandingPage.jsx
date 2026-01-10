import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const containerRef = useRef(null);
    const devPanelRef = useRef(null);
    const artistPanelRef = useRef(null);
    const navigate = useNavigate();
    const ctx = useRef(gsap.context(() => { })); // GSAP Cleanup Context

    // FORCE DARK BACKGROUND (Fix white flash on reload)
    useLayoutEffect(() => {
        // Set page title - matches format
        document.title = "KUBER BASSI | Choose Your Path";

        document.body.style.backgroundColor = '#000';
        document.documentElement.style.backgroundColor = '#000';
        return () => {
            // Cleanup if needed
        };
    }, []);

    useLayoutEffect(() => {
        ctx.current = gsap.context(() => {
            // Initial Entrance Animation
            const tl = gsap.timeline();
            tl.fromTo(devPanelRef.current,
                { x: '-101%' },
                { x: '0%', duration: 1.4, ease: 'expo.out' }
            )
                .fromTo(artistPanelRef.current,
                    { x: '101%' },
                    { x: '0%', duration: 1.4, ease: 'expo.out' },
                    "<"
                )
                .fromTo('.landing-title, .landing-subtitle',
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, stagger: 0.1, duration: 1, ease: "elastic.out(1, 0.75)" },
                    "-=0.8"
                );
        }, containerRef); // Scope to container

        return () => ctx.current.revert(); // CLEANUP: Kills all animations on unmount
    }, []);

    // FLUID HOVER PHYSICS
    const handleMouseEnter = (side) => {
        if (window.innerWidth < 768) return; // Disable hover physics on mobile for stability

        if (side === 'dev') {
            gsap.to(devPanelRef.current, {
                width: '75%',
                clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)',
                duration: 1.2,
                ease: "elastic.out(1, 0.5)",
                overwrite: true // Prevent conflict
            });
            gsap.to(artistPanelRef.current, {
                width: '35%',
                clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)',
                duration: 1.2,
                ease: "elastic.out(1, 0.5)",
                overwrite: true
            });
            gsap.to('.panel-dev .landing-title', { scale: 1.1, color: '#3b82f6', duration: 0.5, overwrite: true });
        } else {
            gsap.to(artistPanelRef.current, {
                width: '75%',
                clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)',
                duration: 1.2,
                ease: "elastic.out(1, 0.5)",
                overwrite: true
            });
            gsap.to(devPanelRef.current, {
                width: '35%',
                clipPath: 'polygon(0 0, 70% 0, 100% 100%, 0 100%)',
                duration: 1.2,
                ease: "elastic.out(1, 0.5)",
                overwrite: true
            });
            gsap.to('.panel-artist .landing-title', { scale: 1.1, color: '#ff0033', duration: 0.5, overwrite: true });
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth < 768) return;

        // Return to center
        gsap.to([devPanelRef.current, artistPanelRef.current], {
            width: '65%',
            duration: 1,
            ease: "elastic.out(1, 0.6)",
            overwrite: true
        });
        // Reset Clips
        gsap.to(devPanelRef.current, { clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)', duration: 1, ease: 'power3.out', overwrite: true });
        gsap.to(artistPanelRef.current, { clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)', duration: 1, ease: 'power3.out', overwrite: true });

        gsap.to('.landing-title', { scale: 1, color: '#fff', duration: 0.5, overwrite: true });
    };

    const handleMouseMove = (e) => {
        if (window.innerWidth < 768) return;

        // Subtle Parallax for Text
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 20;
        const y = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to('.landing-title', { x: x, y: y, duration: 1, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.landing-subtitle', { x: x * 0.5, y: y * 0.5, duration: 1, ease: 'power2.out', overwrite: 'auto' });
    };

    const handleClick = (path) => {
        // Exit Animation
        const tl = gsap.timeline({
            onComplete: () => {
                // Force reload if exiting to clean state? No, standard navigate is better for SPA.
                // Just ensuring we unmount cleanly.
                navigate(path);
            }
        });
        // The chosen side expands to fill screen, other side leaves
        if (path === '/dev') {
            tl.to(artistPanelRef.current, { x: '100%', duration: 0.6, ease: 'power2.in' })
                .to(devPanelRef.current, { width: '100%', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.8, ease: 'expo.inOut' }, "<");
        } else {
            tl.to(devPanelRef.current, { x: '-100%', duration: 0.6, ease: 'power2.in' })
                .to(artistPanelRef.current, { width: '100%', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.8, ease: 'expo.inOut' }, "<");
        }
    };

    return (
        <main className="landing-container" ref={containerRef} onMouseMove={handleMouseMove}>

            {/* --- DEVELOPER PANEL --- */}
            <div
                className="split-panel panel-dev"
                ref={devPanelRef}
                onMouseEnter={() => handleMouseEnter('dev')}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick('/dev')}
            >
                <div className="panel-bg-gfx dev-gfx"></div> {/* Placeholder for dynamic BG */}
                <div className="panel-content">
                    <h1 className="landing-title">CODE</h1>
                    <span className="landing-subtitle">SYSTEM ARCHITECT</span>
                </div>
            </div>

            {/* --- ARTIST PANEL --- */}
            <div
                className="split-panel panel-artist"
                ref={artistPanelRef}
                onMouseEnter={() => handleMouseEnter('artist')}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick('/music')}
            >
                <div className="panel-bg-gfx artist-gfx"></div> {/* Placeholder for dynamic BG */}
                <div className="panel-content">
                    <h1 className="landing-title">MUSIC</h1>
                    <span className="landing-subtitle">ARTIST & PRODUCER</span>
                </div>
            </div>

        </main>
    );
};

export default LandingPage;
