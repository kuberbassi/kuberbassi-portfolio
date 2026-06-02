import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/FloatingBackButton.module.css';

const FloatingBackButton = () => {
    const handleExit = (e) => {
        // Prevent default link behavior
        e.preventDefault();

        const hostname = window.location.hostname;
        const isLocal = hostname === 'localhost' || hostname.includes('127.0.0.1');

        if (isLocal) {
            // In local, just go to root /
            window.location.href = '/';
        } else {
            // In production, go to main domain (remove subdomain)
            // If on music.kuberbassi.com or dev.kuberbassi.com, go to kuberbassi.com
            window.location.href = 'https://kuberbassi.com';
        }
    };

    return (
        <div className={styles.container}>
            <a href="/" onClick={handleExit} className={styles.bubble}>
                <span className={styles.icon}>✕</span>
                <span className={styles.tooltip}>EXIT</span>
            </a>
        </div>
    );
};

export default FloatingBackButton;
