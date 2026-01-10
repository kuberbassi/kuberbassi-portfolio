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
        // TEMPORARILY DISABLED - was hiding content
        /*
        const tl = gsap.timeline();

        tl.from(`.${styles.sloganLine}`, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out"
        })
            .from(`.${styles.imageLayer}`, {
                y: 50,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out"
            }, "-=1")
            .from(`.${styles.sidebarLeft}, .${styles.sidebarRight}, .${styles.footerInfo}`, {
                opacity: 0,
                duration: 1
            }, "-=0.5");
        */
    }, { scope: containerRef });

    return (
        <section id="hero" className={styles.hero} ref={containerRef} data-section-theme="dark">
            {/* <div className={styles.canvasWrapper}>
                <GlitchCanvas />
            </div> */}
            <div className={styles.grain}></div>

            <div className={styles.centerStage}>
                <div className={styles.textLayer} ref={textRef}>
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

            <aside className={styles.sidebarLeft}>
                <a href="https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><i className="fab fa-youtube"></i></a>
                <a href="https://www.instagram.com/kuberbassi.music/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><i className="fab fa-instagram"></i></a>
                <a href="https://www.facebook.com/kuberbassi.music/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><i className="fab fa-facebook"></i></a>
                <a href="mailto:kuberbassi2007@gmail.com" className={styles.socialIcon}><i className="fas fa-envelope"></i></a>
            </aside>

            <aside className={styles.sidebarRight} onClick={() => setSoundOn(!soundOn)}>
                <div className={styles.soundToggle}>
                    {soundOn ? "SOUND ON" : "SOUND OFF"}
                    <span className={styles.soundIndicator} style={{ opacity: soundOn ? 1 : 0.3 }}></span>
                </div>
            </aside>

            <div className={styles.footerInfo}>
                <div className={styles.footerCol}>
                    <h5>WHAT I DO</h5>
                    <ul>
                        <li>GUITARIST</li>
                        <li>MUSIC PRODUCER</li>
                        <li>SOUND DESIGNER</li>
                    </ul>
                </div>
                <div className={styles.footerCol} style={{ textAlign: 'right' }}>
                    <h5>EXPERTISE</h5>
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
