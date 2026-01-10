import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/KineticLanding.css';

import KineticCursor from '../components/KineticCursor';

const KineticLandingPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const codeLayerRef = useRef(null);
    const separatorRef = useRef(null);
    const isTransitioning = useRef(false);

    // Physics State
    const mouse = useRef({ x: 0.5 }); // 0.0 to 1.0
    const splitState = useRef({ val: 50 }); // 0 to 100 (Percentage)

    useLayoutEffect(() => {
        document.body.style.backgroundColor = '#000';
        document.documentElement.style.backgroundColor = '#000';
    }, []);

    useEffect(() => {
        let animationFrameId;

        const updatePhysics = () => {
            if (isTransitioning.current) return;

            // Target split is based on mouse X
            // Center is 50.
            // Mouse Left (0.0) -> Push split right (reveal more Code? No, Code is Left layer.)
            // Logic Check:
            // Code is Left Layer (Top z-index).
            // If dragging slider Right -> Show more Code.
            // So if Mouse X is 0.9 (Right), Split should be larger (e.g. 60 or 70).
            // If Mouse X is 0.1 (Left), Split should be smaller (e.g. 30 or 40).
            // BUT, usually "Hovering Music (Right)" expands Music.
            // If I hover Right, I want Music (bottom layer) to grow.
            // So Code (Top Layer/Clip) must SHRINK.
            // So Split must decrease.
            // Mouse Right (0.9) -> Split Decrease -> Code Shrinks -> Music Grows.

            // Map Mouse X (0..1) to Target Split (60..40)
            // Left (0) -> 60 (More Code)
            // Right (1) -> 40 (More Music)

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
            // Move text slightly OPPOSITE to mouse to create depth
            const pX = (mouse.current.x - 0.5) * 50;
            gsap.to('.text-code-container', { x: pX, duration: 1, ease: 'power2.out' });
            gsap.to('.text-music-container', { x: -pX, duration: 1, ease: 'power2.out' });
        };

        window.addEventListener('mousemove', onMouseMove);
        updatePhysics();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const applySplit = (val) => {
        if (!codeLayerRef.current) return;

        // Diagonal offset (Skew amount)
        // Top point: val + 5
        // Bottom point: val - 5
        const topX = val + 5;
        const botX = val - 5;

        // Clip Code Layer (Left Side)
        codeLayerRef.current.style.clipPath = `polygon(0 0, ${topX}% 0, ${botX}% 100%, 0 100%)`;

        // Separator Line (Thin slice)
        // Positioned exactly on the edge
        if (separatorRef.current) {
            // A thin polygon strip
            separatorRef.current.style.clipPath = `polygon(${topX}% 0, ${topX + 0.2}% 0, ${botX + 0.2}% 100%, ${botX}% 100%)`;
        }
    };

    const handleNavigate = (path) => {
        if (isTransitioning.current) return;
        isTransitioning.current = true;
        console.log("Navigating to:", path);

        const tl = gsap.timeline({
            onComplete: () => {
                navigate(path);
            }
        });

        // HIDE UI
        tl.to('.center-hint-v3, .kinetic-footer', { opacity: 0, duration: 0.3 }, 0);

        if (path === '/dev') {
            // GOING TO CODE (Left)
            // Interaction: "Slash" moves to the RIGHT (100%), filling screen with Code.

            // 1. Zoom/Scale Effect
            tl.to('.text-code', { scale: 1.2, x: 0, duration: 1, ease: 'expo.inOut' }, 0);
            tl.to('.text-music', { x: 100, opacity: 0, duration: 0.5 }, 0); // Bye Music

            // 2. The Slash Wipe
            const obj = { val: splitState.current.val };
            tl.to(obj, {
                val: 120, // Verify far right (clear screen)
                duration: 0.8,
                ease: 'expo.inOut',
                onUpdate: () => applySplit(obj.val)
            }, 0);

            // 3. Grid Flash
            tl.to('.bg-grid-cyber', { opacity: 0.8, scale: 1.1, duration: 0.8 }, 0);

        } else {
            // GOING TO MUSIC (Right)
            // Interaction: "Slash" moves to the LEFT (-20%), revealing full Music.

            // 1. Zoom Effect
            tl.to('.text-music', { scale: 1.2, x: 0, duration: 1, ease: 'expo.inOut' }, 0);
            tl.to('.text-code', { x: -100, opacity: 0, duration: 0.5 }, 0); // Bye Code

            // 2. The Slash Wipe
            const obj = { val: splitState.current.val };
            tl.to(obj, {
                val: -20, // Way left (Code layer clipped to nothing)
                duration: 0.8,
                ease: 'expo.inOut',
                onUpdate: () => applySplit(obj.val)
            }, 0);

            // 3. Nebula Brighten
            tl.to('.bg-nebula-deep', { opacity: 1, scale: 1.2, duration: 0.8 }, 0);
        }
    };

    return (
        <div className="kinetic-container" ref={containerRef} style={{ cursor: 'none' }}>
            <KineticCursor />

            {/* --- LAYERS --- */}

            {/* 1. MUSIC (Bottom Layer - Full Screen) */}
            <div className="section-layer section-music" onClick={() => handleNavigate('/music')}>
                <div className="bg-nebula-deep"></div>
                <div className="kinetic-content text-music-container">
                    {/* Offset text to the right so it's centered in the visible space?
                         Actually, standard center is fine, the user will "uncover" it.
                         But let's nudge it slightly Right. */}
                    <div style={{ transform: 'translateX(25vw)' }}>
                        <h1 className="title-huge text-music">MUSIC</h1>
                        <span className="subtitle-mono">ARTIST</span>
                    </div>
                </div>
            </div>

            {/* 2. CODE (Top Layer - Clipped) */}
            <div className="section-layer section-code" ref={codeLayerRef} onClick={() => handleNavigate('/dev')}>
                <div className="bg-grid-cyber"></div>
                <div className="kinetic-content text-code-container">
                    {/* Nudge Left for visual balance */}
                    <div style={{ transform: 'translateX(-25vw)' }}>
                        <h1 className="title-huge text-code">CODE</h1>
                        <span className="subtitle-mono">ARCHITECT</span>
                    </div>
                </div>
            </div>

            {/* 3. SEPARATOR (Glass Shard) */}
            <div
                className="glass-separator"
                ref={separatorRef}
            ></div>

            {/* --- UI --- */}
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
