import React, { useState } from 'react';
import styles from './styles/SocialSidebar.module.css';

const SocialSidebar = () => {
    const [soundOn, setSoundOn] = useState(true);

    return (
        <>
            <aside className={styles.sidebarLeft}>
                <a href="https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><i className="fab fa-youtube"></i></a>
                <a href="https://www.instagram.com/kuberbassi.music/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><i className="fab fa-instagram"></i></a>
                <a href="https://www.facebook.com/kuberbassi.music/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><i className="fab fa-facebook"></i></a>
                <a href="mailto:kuberbassi2007@gmail.com" className={styles.socialIcon}><i className="fas fa-envelope"></i></a>
            </aside>

            {/* Liquid Audio Bar - Bottom Left (Mirrors Sound Toggle) */}
            <aside className={styles.sidebarBottomLeft}>
                <span className={styles.audioLabel}>AUDIO</span>
                <div className={styles.liquidContainer}>
                    <div className={styles.liquid}></div>
                </div>
            </aside>

            <aside className={styles.sidebarRight} onClick={() => setSoundOn(!soundOn)}>
                <div className={styles.soundToggle}>
                    {soundOn ? "SOUND ON" : "SOUND OFF"}
                    <span className={styles.soundIndicator} style={{ opacity: soundOn ? 1 : 0.3 }}></span>
                </div>
            </aside>
        </>
    );
};

export default SocialSidebar;
