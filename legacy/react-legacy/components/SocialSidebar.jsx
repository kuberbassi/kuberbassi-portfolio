import React, { useState, useEffect } from 'react';
import styles from './styles/SocialSidebar.module.css';
import audioSynth from '../utils/audioSynth';

const SocialSidebar = () => {
    const [soundOn, setSoundOn] = useState(false); // Default to false to respect browser autoplay rules

    const handleToggle = () => {
        const nextState = !soundOn;
        setSoundOn(nextState);
        if (nextState) {
            audioSynth.startDrone();
        } else {
            audioSynth.stopDrone();
        }
    };

    // Clean up synth when unmounting
    useEffect(() => {
        return () => {
            audioSynth.stopDrone();
        };
    }, []);

    return (
        <>
            <aside className={styles.sidebarLeft}>
                <a href="https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                <a href="https://www.instagram.com/kuberbassi.music/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="https://www.facebook.com/kuberbassi.music/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                <a href="mailto:me@kuberbassi.com" className={styles.socialIcon} aria-label="Email"><i className="fas fa-envelope"></i></a>
            </aside>

            {/* Liquid Audio Bar - Bottom Left (Mirrors Sound Toggle) */}
            <aside className={styles.sidebarBottomLeft}>
                <span className={styles.audioLabel}>AUDIO</span>
                <div className={styles.liquidContainer}>
                    <div className={`${styles.liquid} ${soundOn ? styles.active : ''}`}></div>
                </div>
            </aside>

            <aside className={styles.sidebarRight} onClick={handleToggle}>
                <div className={styles.soundToggle}>
                    {soundOn ? "SOUND ON" : "SOUND OFF"}
                    <span className={styles.soundIndicator} style={{ opacity: soundOn ? 1 : 0.3 }}></span>
                </div>
            </aside>
        </>
    );
};

export default SocialSidebar;

