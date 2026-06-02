import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/KineticLanding.css';

import KineticCursor from '../components/KineticCursor';
import SEO from '../components/SEO';

const KineticLandingPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const codeLayerRef = useRef(null);
    const separatorRef = useRef(null);
    const isTransitioning = useRef(false);

    // Physics State
    const mouse = useRef({ x: 0.5 }); // 0.0 to 1.0
    const splitState = useRef({ val: 50 }); // 0 to 100 (Percentage)

    // FORCE DARK BACKGROUND
    useLayoutEffect(() => {
        // Set page title - matches format
        document.title = "KUBER BASSI | Choose Your Path";

        document.body.style.backgroundColor = '#000';
        document.documentElement.style.backgroundColor = '#000';
    }, []);

    const applySplit = (val) => {
        if (!codeLayerRef.current) return;

        // Diagonal offset (Skew amount)
        const topX = val + 5;
        const botX = val - 5;

        // Clip Code Layer (Left Side)
        codeLayerRef.current.style.clipPath = `polygon(0 0, ${topX}% 0, ${botX}% 100%, 0 100%)`;

        // Separator Line (Thin slice)
        if (separatorRef.current) {
            separatorRef.current.style.clipPath = `polygon(${topX}% 0, ${topX + 0.2}% 0, ${botX + 0.2}% 100%, ${botX}% 100%)`;
        }
    };

    useEffect(() => {
        let animationFrameId;

        const updatePhysics = () => {
            if (isTransitioning.current) return;

            // Check for Mobile/Tablet (Vertical Layout)
            if (window.innerWidth <= 1024) {
                if (codeLayerRef.current) codeLayerRef.current.style.clipPath = '';
                if (separatorRef.current) separatorRef.current.style.clipPath = '';

                animationFrameId = requestAnimationFrame(updatePhysics);
                return;
            }

            const targetSplit = 60 - (mouse.current.x * 20); // Range 60 to 40

            // Lerp for smoothness
            splitState.current.val += (targetSplit - splitState.current.val) * 0.1;

            applySplit(splitState.current.val);

            animationFrameId = requestAnimationFrame(updatePhysics);
        };

        const onMouseMove = (e) => {
            if (isTransitioning.current) return;
            mouse.current.x = e.clientX / window.innerWidth;

            // Internal Parallax for Text
            if (window.innerWidth > 768) {
                const pX = (mouse.current.x - 0.5) * 50;
                gsap.to('.text-code-container', { x: pX, duration: 1, ease: 'power2.out' });
                gsap.to('.text-music-container', { x: -pX, duration: 1, ease: 'power2.out' });
            } else {
                gsap.to('.text-code-container', { x: 0, duration: 1 });
                gsap.to('.text-music-container', { x: 0, duration: 1 });
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        updatePhysics();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleNavigate = (path) => {
        if (isTransitioning.current) return;
        isTransitioning.current = true;

        const tl = gsap.timeline({
            onComplete: () => {
                const isLocal = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');

                if (isLocal) {
                    navigate(path);
                } else {
                    if (path === '/dev') window.location.href = 'https://dev.kuberbassi.com';
                    else if (path === '/music') window.location.href = 'https://music.kuberbassi.com';
                    else navigate(path);
                }
            }
        });

        tl.to('.center-hint-v3, .kinetic-footer, .glass-separator', { opacity: 0, duration: 0.3 }, 0);

        const isMobile = window.innerWidth <= 1024;

        if (path === '/dev') {
            tl.to('.text-code', { scale: 1.2, x: 0, duration: 1, ease: 'expo.inOut' }, 0);
            tl.to('.text-music', { x: isMobile ? 0 : 100, opacity: 0, duration: 0.5 }, 0);

            if (!isMobile) {
                const obj = { val: splitState.current.val };
                tl.to(obj, {
                    val: 120,
                    duration: 0.8,
                    ease: 'expo.inOut',
                    onUpdate: () => applySplit(obj.val)
                }, 0);
            } else {
                tl.to('.section-music', { opacity: 0, duration: 0.5 }, 0);
                tl.to('.section-code', { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.8, ease: 'expo.inOut' }, 0);
            }

            tl.to('.bg-grid-cyber', { opacity: 0.8, scale: 1.1, duration: 0.8 }, 0);

        } else {
            tl.to('.text-music', { scale: 1.2, x: 0, duration: 1, ease: 'expo.inOut' }, 0);
            tl.to('.text-code', { x: isMobile ? 0 : -100, opacity: 0, duration: 0.5 }, 0);

            if (!isMobile) {
                const obj = { val: splitState.current.val };
                tl.to(obj, {
                    val: -20,
                    duration: 0.8,
                    ease: 'expo.inOut',
                    onUpdate: () => applySplit(obj.val)
                }, 0);
            } else {
                tl.to('.section-code', { opacity: 0, duration: 0.5 }, 0);
            }

            tl.to('.bg-nebula-deep', { opacity: 1, scale: 1.2, duration: 0.8 }, 0);
        }
    };

    return (
        <div className="kinetic-container" ref={containerRef} style={{ cursor: 'none' }}>
            <SEO
                title="KUBER BASSI | Choose Your Path"
                description="Explore my creative worlds - immersive guitar instrumentals or cutting-edge development projects. Choose your interface: Music or Code."
                keywords="Kuber Bassi, portfolio, musician, developer, guitarist, software engineer, music producer, full-stack developer"
                ogType="website"
                url="https://kuberbassi.com"
            />
            <KineticCursor />
            <div className="section-layer section-music" onClick={() => handleNavigate('/music')}>
                <div className="bg-nebula-deep"></div>
                <div className="kinetic-content text-music-container">
                    <div className="text-offset-right">
                        <h1 className="title-huge text-music">MUSIC</h1>
                        <span className="subtitle-mono">ARTIST</span>
                    </div>
                </div>
            </div>
            <div className="section-layer section-code" ref={codeLayerRef} onClick={() => handleNavigate('/dev')}>
                <div className="bg-grid-cyber"></div>
                <div className="kinetic-content text-code-container">
                    <div className="text-offset-left">
                        <h1 className="title-huge text-code">CODE</h1>
                        <span className="subtitle-mono">ARCHITECT</span>
                    </div>
                </div>
            </div>
            <div className="glass-separator" ref={separatorRef}></div>
            <div className="center-hint-v3">
                <span>SELECT INTERFACE</span>
            </div>
            <div className="kinetic-footer">
                &copy; 2025-{new Date().getFullYear()} Kuber Bassi.
            </div>
        </div>
    );
};

export default KineticLandingPage;
