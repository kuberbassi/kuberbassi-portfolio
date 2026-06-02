import React, { useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/LandingPage.css';

// ============================================================
//  AURORA CANVAS — Plasma shader via 2D canvas
// ============================================================
const AuroraCanvas = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;
        let t = 0;

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;
            t += 0.004;

            // Draw layered aurora blobs
            ctx.clearRect(0, 0, W, H);

            const blobs = [
                // Dev side — green aurora
                { x: W * 0.22, y: H * 0.5 + Math.sin(t * 0.9) * H * 0.15,  r: W * 0.38, color: [0, 255, 136,  0.06] },
                { x: W * 0.15, y: H * 0.3 + Math.cos(t * 1.1) * H * 0.1,   r: W * 0.2,  color: [0, 200, 255,  0.04] },
                // Artist side — red/magenta aurora
                { x: W * 0.78, y: H * 0.5 + Math.cos(t * 0.7) * H * 0.12,  r: W * 0.38, color: [255, 30,  80,  0.07] },
                { x: W * 0.85, y: H * 0.7 + Math.sin(t * 1.3) * H * 0.1,   r: W * 0.22, color: [200, 0,  180,  0.04] },
                // Center accent — purple
                { x: W * 0.5  + Math.sin(t * 0.5) * W * 0.06,
                  y: H * 0.5  + Math.cos(t * 0.4) * H * 0.08,               r: W * 0.15, color: [120, 80, 255,  0.05] },
            ];

            blobs.forEach(b => {
                const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
                grad.addColorStop(0,   `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${b.color[3]})`);
                grad.addColorStop(1,   `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fill();
            });

            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} className="landing-aurora-canvas" />;
};


// ============================================================
//  LANDING PAGE
// ============================================================
const LandingPage = () => {
    const containerRef    = useRef(null);
    const devPanelRef     = useRef(null);
    const artistPanelRef  = useRef(null);
    const navigate        = useNavigate();
    const ctx             = useRef(gsap.context(() => {}));

    useLayoutEffect(() => {
        document.title = "KUBER BASSI | Choose Your Path";
        document.body.style.backgroundColor = '#000';
        document.documentElement.style.backgroundColor = '#000';
    }, []);

    // ── Initial entrance animation ──
    useLayoutEffect(() => {
        ctx.current = gsap.context(() => {
            const tl = gsap.timeline();
            tl.fromTo(devPanelRef.current,
                { x: '-101%' },
                { x: '0%', duration: 1.4, ease: 'expo.out' }
            )
            .fromTo(artistPanelRef.current,
                { x: '101%' },
                { x: '0%', duration: 1.4, ease: 'expo.out' },
                '<'
            )
            .fromTo('.landing-title, .landing-subtitle',
                { opacity: 0, scale: 0.85, y: 20 },
                { opacity: 1, scale: 1, y: 0, stagger: 0.08, duration: 1.1, ease: 'back.out(1.7)' },
                '-=0.9'
            )
            // Split line draws itself in
            .fromTo('.landing-split-line',
                { scaleY: 0, opacity: 0 },
                { scaleY: 1, opacity: 1, duration: 1.2, ease: 'power3.out', transformOrigin: 'center center' },
                '-=0.8'
            );
        }, containerRef);
        return () => ctx.current.revert();
    }, []);

    // ── Hover expand ──
    const handleMouseEnter = useCallback((side) => {
        if (window.innerWidth < 768) return;
        const el = containerRef.current;
        if (!el) return;
        el.classList.remove('hover-dev', 'hover-artist');
        el.classList.add(side === 'dev' ? 'hover-dev' : 'hover-artist');

        if (side === 'dev') {
            gsap.to(devPanelRef.current,    { width: '78%', clipPath: 'polygon(0 0, 100% 0, 93% 100%, 0 100%)', duration: 1.1, ease: 'elastic.out(1,0.5)', overwrite: true });
            gsap.to(artistPanelRef.current, { width: '34%', clipPath: 'polygon(28% 0, 100% 0, 100% 100%, 0 100%)', duration: 1.1, ease: 'elastic.out(1,0.5)', overwrite: true });
        } else {
            gsap.to(artistPanelRef.current, { width: '78%', clipPath: 'polygon(7% 0, 100% 0, 100% 100%, 0 100%)', duration: 1.1, ease: 'elastic.out(1,0.5)', overwrite: true });
            gsap.to(devPanelRef.current,    { width: '34%', clipPath: 'polygon(0 0, 72% 0, 100% 100%, 0 100%)', duration: 1.1, ease: 'elastic.out(1,0.5)', overwrite: true });
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (window.innerWidth < 768) return;
        const el = containerRef.current;
        if (el) { el.classList.remove('hover-dev', 'hover-artist'); }
        gsap.to([devPanelRef.current, artistPanelRef.current], { width: '65%', duration: 1, ease: 'elastic.out(1,0.6)', overwrite: true });
        gsap.to(devPanelRef.current,    { clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)', duration: 1, ease: 'power3.out', overwrite: true });
        gsap.to(artistPanelRef.current, { clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)', duration: 1, ease: 'power3.out', overwrite: true });
    }, []);

    // ── Parallax mouse move ──
    const handleMouseMove = useCallback((e) => {
        if (window.innerWidth < 768) return;
        const x = (e.clientX / window.innerWidth  - 0.5) * 22;
        const y = (e.clientY / window.innerHeight - 0.5) * 22;
        gsap.to('.landing-title',    { x, y, duration: 1, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.landing-subtitle', { x: x * 0.4, y: y * 0.4, duration: 1, ease: 'power2.out', overwrite: 'auto' });
    }, []);

    // ── Click: ripple shockwave + chromatic aberration + navigate ──
    const handleClick = useCallback((e, path) => {
        // Ripple element at click point
        const ripple = document.createElement('div');
        ripple.className = 'landing-ripple';
        const size = 100;
        Object.assign(ripple.style, {
            width:  `${size}px`,
            height: `${size}px`,
            left:   `${e.clientX}px`,
            top:    `${e.clientY}px`,
        });
        // Color based on path
        ripple.style.borderColor = path === '/dev' ? 'rgba(0,255,136,0.7)' : 'rgba(255,0,51,0.7)';
        ripple.style.boxShadow   = path === '/dev'
            ? '0 0 30px rgba(0,255,136,0.4), inset 0 0 20px rgba(0,255,136,0.2)'
            : '0 0 30px rgba(255,0,51,0.4), inset 0 0 20px rgba(255,0,51,0.2)';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 900);

        // Chromatic exit
        const container = containerRef.current;
        if (container) container.classList.add('is-exiting');

        // Exit tl
        const tl = gsap.timeline({ onComplete: () => navigate(path) });
        if (path === '/dev') {
            tl.to(artistPanelRef.current, { x: '100%', opacity: 0, duration: 0.55, ease: 'power2.in' })
              .to(devPanelRef.current,    { width: '100%', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.7, ease: 'expo.inOut' }, '<');
        } else {
            tl.to(devPanelRef.current,    { x: '-100%', opacity: 0, duration: 0.55, ease: 'power2.in' })
              .to(artistPanelRef.current, { width: '100%', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.7, ease: 'expo.inOut' }, '<');
        }
    }, [navigate]);

    return (
        <main
            className="landing-container"
            ref={containerRef}
            onMouseMove={handleMouseMove}
        >
            {/* Aurora plasma background */}
            <AuroraCanvas />

            {/* Neon split-line */}
            <div className="landing-split-line" />

            {/* Version badge */}
            <div className="landing-version-badge">
                v{new Date().getFullYear()}.1 // SELECT_DIMENSION // ACTIVE
            </div>

            {/* --- DEVELOPER PANEL --- */}
            <div
                className="split-panel panel-dev"
                ref={devPanelRef}
                onMouseEnter={() => handleMouseEnter('dev')}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => handleClick(e, '/dev')}
            >
                <div className="panel-bg-gfx dev-gfx" />
                <div className="panel-content">
                    <h1 className="landing-title landing-title-dev">CODE</h1>
                    <span className="landing-subtitle">SYSTEM ARCHITECT</span>
                </div>
            </div>

            {/* --- ARTIST PANEL --- */}
            <div
                className="split-panel panel-artist"
                ref={artistPanelRef}
                onMouseEnter={() => handleMouseEnter('artist')}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => handleClick(e, '/music')}
            >
                <div className="panel-bg-gfx artist-gfx" />
                <div className="panel-content">
                    <h1 className="landing-title landing-title-artist">MUSIC</h1>
                    <span className="landing-subtitle">ARTIST & PRODUCER</span>
                </div>
            </div>
        </main>
    );
};

export default LandingPage;


