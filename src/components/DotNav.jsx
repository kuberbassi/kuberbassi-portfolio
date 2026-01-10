import React from 'react';
import styles from './styles/DotNav.module.css';

const DotNav = () => {
    // Active state logic handles external manipulation of classes on elements with class 'dot-link'
    // We need to ensure we use that class name or update the ScrollTrigger logic in MusicPortfolio.
    // The ScrollTrigger logic selects '.dot-link'.

    const handleClick = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });

        // Manual Update for Instant Feedback
        document.querySelectorAll('.dot-link').forEach(link => {
            link.classList.remove('active');
            link.style.backgroundColor = '#a3a3a3';
            link.style.transform = 'scale(1)';
        });

        // Find the specific link and activate it
        const activeLink = document.querySelector(`.dot-link[data-section="${id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.style.backgroundColor = '#ff0033';
            activeLink.style.transform = 'scale(1.5)';
        }
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
