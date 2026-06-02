import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './styles/HeroSection.module.css';

// Animated waveform SVG bars
const AuroraWaveform = () => {
    const barCount = 28;
    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '4px',
            height: '48px',
            width: '100%',
            position: 'absolute',
            bottom: '6rem',
            left: 0,
            pointerEvents: 'none',
            zIndex: 5,
            opacity: 0.5,
        }}>
            {Array.from({ length: barCount }).map((_, i) => {
                const speed = 0.4 + (i % 7) * 0.12;
                const maxH  = 8 + (i % 5) * 8;
                return (
                    <div
                        key={i}
                        style={{
                            width: '3px',
                            borderRadius: '2px',
                            background: `linear-gradient(to top, #ff0033, #ff6699)`,
                            animation: `waveBarScale ${speed}s ease-in-out ${(i * 0.04).toFixed(2)}s infinite alternate`,
                            height: `${maxH}px`, // Render at full maximum height
                            transformOrigin: 'bottom center', // Scale up from the bottom hinge
                            willChange: 'transform, opacity',
                        }}
                    />
                );
            })}
            <style>{`
                @keyframes waveBarScale {
                    0%   { transform: scaleY(0.12); opacity: 0.4; }
                    100% { transform: scaleY(1.0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};


const HeroSection = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useGSAP(() => {
        const textLayer = textRef.current;
        if (!textLayer) return;

        // Initialize optimized quickTo setters to bypass tween instantiation overhead on mousemove
        const xTo = gsap.quickTo(textLayer, "x", { duration: 0.8, ease: "power2.out" });
        const yTo = gsap.quickTo(textLayer, "y", { duration: 0.8, ease: "power2.out" });
        const rotateYTo = gsap.quickTo(textLayer, "rotateY", { duration: 0.8, ease: "power2.out" });
        const rotateXTo = gsap.quickTo(textLayer, "rotateX", { duration: 0.8, ease: "power2.out" });

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate distance from center (-0.5 to 0.5)
            const xPos = (clientX / innerWidth) - 0.5;
            const yPos = (clientY / innerHeight) - 0.5;

            xTo(xPos * 15);
            yTo(yPos * 15);
            rotateYTo(xPos * 8);
            rotateXTo(-yPos * 8);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, { scope: containerRef });

    return (
        <section id="hero" className={styles.hero} ref={containerRef} data-section-theme="dark">
            {/* <div className={styles.canvasWrapper}>
                <GlitchCanvas />
            </div> */}
            <div className={styles.grain}></div>

            <div className={styles.centerStage}>
                <div className={styles.textLayer} ref={textRef} data-nosnippet>
                    <h1 className={styles.slogan}>
                        <span className={styles.smallLabel}>
                            KU<span style={{ color: '#ff3333' }}>β</span>ER <span style={{ color: '#ff3333' }}>β</span><span style={{ color: '#ff3333' }}>Δ</span>SSI PRESENTS
                        </span>
                        <span className={`${styles.sloganLine} ${styles.interactiveText}`}>PROGRESS</span>
                        <span className={`${styles.sloganLine} ${styles.interactiveText}`}>ISN'T A GOAL</span>
                        <span className={styles.sloganLine}>IT'S A <span className={`${styles.accent} ${styles.interactiveText}`}>RHYTHM</span></span>
                    </h1>
                </div>

                <div className={styles.imageLayer}>
                    <img src="/music-portfolio/assets/images/hero-guitar-3d.png" alt="Electric Guitar 3D" fetchpriority="high" decoding="async" />
                </div>
            </div>

            {/* Animated waveform bars */}
            <AuroraWaveform />

            <div className={styles.footerInfo}>
                <div className={styles.footerCol}>
                    <h3>WHAT I DO</h3>
                    <ul>
                        <li>GUITARIST</li>
                        <li>MUSIC PRODUCER</li>
                        <li>SOUND DESIGNER</li>
                    </ul>
                </div>
                <div className={styles.footerCol} style={{ textAlign: 'right' }}>
                    <h3>EXPERTISE</h3>
                    <ul>
                        <li>TONE CRAFTING</li>
                        <li>FULL PRODUCTION</li>
                        <li>MIXING & MASTERING</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
