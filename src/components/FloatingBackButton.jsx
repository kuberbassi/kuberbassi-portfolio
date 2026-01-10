import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/FloatingBackButton.module.css';

const FloatingBackButton = () => {
    return (
        <div className={styles.container}>
            <Link to="/" className={styles.bubble}>
                <span className={styles.icon}>✕</span>
                <span className={styles.tooltip}>EXIT</span>
            </Link>
        </div>
    );
};

export default FloatingBackButton;
