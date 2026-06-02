import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/FluidLanding.css';

const FluidLandingPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const overlayPathRef = useRef(null);

    // Physics State
    const mouse = useRef({ x: 0.5, y: 0.5 });
    const curve = useRef({ x: 0.5, currX: 0.5 });
    const isTransitioning = useRef(false); // Fix ReferenceError

    useLayoutEffect(() => {
        document.body.style.backgroundColor = '#050505';
        document.documentElement.style.backgroundColor = '#050505';
    }, []);

    useEffect(() => {
        const path = overlayPathRef.current;
        let animationFrameId;

        let time = 0;

        const updateCurve = () => {
            time += 0.05;

            // LERP for smooth feel
            const targetX = mouse.current.x;
            curve.current.currX += (targetX - curve.current.currX) * 0.1;

            // Normalize Coordinates (0.0 to 1.0)
            const x = curve.current.currX;
            const y = mouse.current.y * 1.5 - 0.25;

            // Turbulence (Subtle organic liquid Ripples)
            // Reduced amplitude to prevent "glitchy" look
            const noise = Math.sin(y * 8 - time) * 0.005 + Math.cos(y * 12 + time * 1.5) * 0.003;

            // Apply turbulence
            const organicX = x + noise;

            // The Split Line (Right Side shape):
            // M 0.5 0 (Top Center)
            // Q {controlX} {centerY} 0.5 1 (Curve to Bottom Center)
            // L 1 1 (Bottom Right)
            // L 1 0 (Top Right)
            // Z

            // Deflection logic:
            // If dragging Left (x < 0.5), we want more of Right visible -> Curve bulges Left.
            // Actually, if we overlay Right on top:
            // Mouse Left -> We want to see Dev (Left). So Right (Overlay) should shrink.
            // Mouse Right -> We want to see Music (Right). So Right (Overlay) should grow.

            // Current Logic Issue: 
            // If I move mouse Left (x=0.1), I want 'Dev' content.
            // Dev is Layer 1 (Base). Music is Layer 2 (Overlay).
            // So Overlay must SHRINK to reveal Base.
            // Path defines Overlay visibility.
            // So if x=0.1, Path should be narrow (small area).
            // If x=0.9, Path should be wide (large area).

            // Let's redefine the curve anchor points based on X.
            // Anchor Top: (x, 0) ? No, that's a wipe. User wants curve.
            // Let's anchor Top/Bottom at 0.5?
            // And curve the middle control point to x?

            // If x=0.1 (Mouse Left), we want small overlay area.
            // Anchor can stay at 0.5, but CP moves WAY right? No, that hides overlay.
            // Wait, Overlay is Music.
            // If Mouse Left -> Show Dev -> Hide Music -> Overlay Shrinks.
            // If Mouse Right -> Show Music -> Overlay Grows.

            // Let's map X directly to the "width" of the overlay at the mouse Y height.
            // The ends can be pinned or move slightly.
            // "Liquid" usually implies the edge follows the mouse.

            // DYNAMIC ANCHORS:
            // Top: x * 0.5 + 0.25 (moves slightly)
            // Bottom: x * 0.5 + 0.25
            // CP: x (moves directly with mouse)

            // CORRECTED LOGIC: 
            // The Control Point (CP) should be near the Anchors (Boundary).
            // NOT at the mouse X (which is inverted).
            // We adding a slight "drag" or "bulge" using the noise, but keeping it aligned.

            const boundaryX = 1.0 - organicX; // RESTORED MISSING VARIABLE
            const cpX = boundaryX - (noise * 5); // Add localized ripple to the edge

            const d = `M ${boundaryX} 0 Q ${cpX} ${mouse.current.y} ${boundaryX} 1 L 1 1 L 1 0 Z`;

            if (path) {
                path.setAttribute('d', d);
            }

            animationFrameId = requestAnimationFrame(updateCurve);
        };

        const onMouseMove = (e) => {
            if (isTransitioning.current) return;
            mouse.current.x = e.clientX / window.innerWidth;
            mouse.current.y = e.clientY / window.innerHeight;

            // Parallax
            const pX = (mouse.current.x - 0.5) * 30;
            const pY = (mouse.current.y - 0.5) * 30;
            gsap.to('.landing-text-dev', { x: pX, y: pY, duration: 1, ease: 'power2.out', overwrite: true });
            gsap.to('.landing-text-music', { x: -pX, y: -pY, duration: 1, ease: 'power2.out', overwrite: true });
        };

        window.addEventListener('mousemove', onMouseMove);
        updateCurve();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleNavigate = (path) => {
        console.log("Navigating to:", path);
        if (isTransitioning.current) return;
        isTransitioning.current = true; // FREEZE physics loop

        // Fallback safety (in case GSAP fails)
        setTimeout(() => {
            navigate(path);
        }, 2000);

        const tl = gsap.timeline({
            onComplete: () => {
                navigate(path);
            }
        });

        // Universal Exit Animations
        tl.to('.center-hint, .landing-footer', { opacity: 0, duration: 0.3, ease: 'power2.out' }, 0);

        if (path === '/music') {
            // ZOOM INTO MUSIC (Right Side)
            // 1. Fade/Scale out Dev Text
            tl.to('.landing-text-dev, .sub-tag', { x: -100, opacity: 0, duration: 0.5 }, 0);

            // 2. Zoom Music Background
            tl.to('.bg-nebula-warp', { scale: 2, opacity: 1, duration: 1.5, ease: 'expo.in' }, 0);

            // 3. Scale Up Music Text (Cinematic Fly-through)
            tl.to('.landing-text-music', { scale: 1.5, opacity: 0, duration: 1, ease: 'power2.in' }, 0);

            // 4. Liquid Explosion (Expand Music Overlay)
            const obj = { b: 0.5 }; // approximate start
            // We need to sync this with the CURRENT curve state ideally, 
            // but for a fast snap, overriding is fine.
            tl.to(obj, {
                b: 0, // Curve to Left Edge (Covering Dev)
                duration: 1.2,
                ease: 'expo.inOut',
                onUpdate: () => {
                    // Flatten curve for proper cover
                    const d = `M ${obj.b} 0 L ${obj.b} 1 L 1 1 L 1 0 Z`;
                    overlayPathRef.current.setAttribute('d', d);
                }
            }, 0);

        } else {
            // ZOOM INTO DEV (Left Side)
            // 1. Fade/Scale out Music Text
            tl.to('.landing-text-music, .sub-tag', { x: 100, opacity: 0, duration: 0.5 }, 0);

            // 2. Zoom Dev Background
            tl.to('.bg-grid-warp', { scale: 3, opacity: 0, duration: 1.5, ease: 'expo.in' }, 0);
            // Note: Grid fading out as we "enter" the matrix code? 
            // Or flying THROUGH the grid.

            // 3. Scale Up Dev Text
            tl.to('.landing-text-dev', { scale: 5, opacity: 0, duration: 1.2, ease: 'expo.in' }, 0);

            // 4. Liquid Retreat (Shrink Music Overlay)
            const obj = { b: 0.5 };
            tl.to(obj, {
                b: 1, // Curve to Right Edge (Revealing Dev)
                duration: 1.2,
                ease: 'expo.inOut',
                onUpdate: () => {
                    const d = `M ${obj.b} 0 L ${obj.b} 1 L 1 1 L 1 0 Z`;
                    overlayPathRef.current.setAttribute('d', d);
                }
            }, 0);
        }
    };

    return (
        <div className="fluid-container" ref={containerRef}>

            {/* LAYER 1: DEVELOPER (Underneath) */}
            <div className="layer-dev" onClick={() => handleNavigate('/dev')}>
                <div className="bg-grid-warp"></div>
                <div className="content-wrap left-align">
                    <h1 className="landing-text-dev">CODE</h1>
                    <span className="sub-tag">ARCHITECT</span>
                </div>
            </div>

            {/* LAYER 2: ARTIST (Overlay via SVG Mask) */}
            {/* We don't use CSS clip-path because we need curved warping */}
            {/* We use an SVG definition for clipPath and reference it? 
                Or simpler: A full div inside an SVG foreignObject? 
                Or: The SVG *is* the shape, filled with the content? 
                
                Best approach for Perf: 
                The "Right Side" is a container with `clip-path: url(#fluid-clip)`.
                We update the `<path>` inside the `<clipPath>`.
            */}

            <div className="layer-music" style={{ clipPath: 'url(#fluid-mask)' }} onClick={() => handleNavigate('/music')}>
                <div className="bg-nebula-warp"></div>
                <div className="content-wrap right-align">
                    <h1 className="landing-text-music">MUSIC</h1>
                    <span className="sub-tag">ARTIST</span>
                </div>
            </div>

            {/* THE INVISIBLE MASK definition */}
            <svg width="0" height="0" className="mask-svg">
                <defs>
                    <clipPath id="fluid-mask" clipPathUnits="objectBoundingBox">
                        <path
                            ref={overlayPathRef}
                            d="M 0.5 0 Q 0.5 0.5 0.5 1 L 1 1 L 1 0 Z"
                        />
                    </clipPath>
                </defs>
            </svg>

            {/* INSTRUCTIONS */}
            <div className="center-hint">
                <span>CHOOSE YOUR REALITY</span>
            </div>

            <div className="landing-footer" style={{
                position: 'absolute',
                bottom: '1rem',
                width: '100%',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.3)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.75rem',
                zIndex: 20,
                pointerEvents: 'none',
                letterSpacing: '0.05em'
            }}>
                &copy; 2025-{new Date().getFullYear()} Kuber Bassi.
            </div>

        </div>
    );
};

export default FluidLandingPage;
