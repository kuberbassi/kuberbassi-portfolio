import React from 'react';
import styles from './styles/DotNav.module.css';

const DotNav = () => {
    // Active state logic handles external manipulation of classes on elements with class 'dot-link'
    // We need to ensure we use that class name or update the ScrollTrigger logic in MusicPortfolio.
    // The ScrollTrigger logic selects '.dot-link'.

    const handleClick = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className={styles.navContainer}>
            <ul className={styles.ul}>
                {['hero', 'about', 'videos', 'music', 'streaming', 'stats', 'newsletter'].map((section) => {
                    // Display names for tooltips
                    const labels = {
                        hero: 'Home',
                        about: 'About',
                        videos: 'Videos',
                        music: 'Music',
                        streaming: 'Streaming',
                        stats: 'Stats',
                        newsletter: 'Connect'
                    };

                    return (
                        <li key={section}>
                            <a
                                onClick={() => handleClick(section)}
                                className={`dot-link ${styles.dotLink}`}
                                data-tooltip={labels[section]}
                                data-section={section}
                            />
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default DotNav;
