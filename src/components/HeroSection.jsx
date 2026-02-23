import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './styles/HeroSection.module.css';
// import GlitchCanvas from './GlitchCanvas'; // TEMPORARILY DISABLED

const HeroSection = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [soundOn, setSoundOn] = useState(true);

    useGSAP(() => {
        const textLayer = textRef.current;
        if (!textLayer) return;

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate distance from center (-0.5 to 0.5)
            const xPos = (clientX / innerWidth) - 0.5;
            const yPos = (clientY / innerHeight) - 0.5;

            // Subtle tilt — keep values small so text stays readable
            gsap.to(textLayer, {
                rotateY: xPos * 8,
                rotateX: -yPos * 8,
                x: xPos * 15,
                y: yPos * 15,
                duration: 0.8,
                ease: "power2.out"
            });
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
                    <img src="/music-portfolio/assets/images/hero-guitar-3d.png" alt="Electric Guitar 3D" />
                </div>
            </div>


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
