import React from 'react';
import { motion } from 'framer-motion';
import styles from './styles/AboutSection.module.css';

const AboutSection = () => {
    return (
        <section id="about" className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={styles.title}>
                        <span className={styles.titleMain}>ABOUT</span>
                        <span className={styles.titleSub}>THE ARTIST</span>
                    </h2>
                </motion.div>

                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className={styles.mainContent}>
                        <div>
                            <span className={styles.role}>// GUITARIST & PRODUCER</span>
                            <h3 className={styles.artistName}>
                                KU<span className={styles.beta}>β</span>ER <span className={styles.beta}>β</span><span className={styles.delta}>Δ</span>SSI
                            </h3>
                        </div>
                        <p className={styles.bio}>
                            Forging soundscapes where <span className={styles.highlight}>raw emotion</span> meets <span className={styles.highlight}>digital precision</span>.
                            My work bridges the gap between classic rock grit and modern electronic production.
                        </p>
                        <p className={styles.bio}>
                            Available for high-impact session work, custom production, and sonic branding.
                        </p>
                    </div>

                    <div className={styles.sidebar}>
                        <div className={styles.techCard}>
                            <span className={styles.cardLabel}>CORE GENRES</span>
                            <div className={styles.tags}>
                                <span className={styles.tag}>ROCK</span>
                                <span className={styles.tag}>INSTRUMENTAL</span>
                                <span className={styles.tag}>DARK POP</span>
                                <span className={styles.tag}>ELECTRONIC</span>
                            </div>
                        </div>

                        <div className={styles.techCard}>
                            <span className={styles.cardLabel}>TECHNICAL ARSENAL</span>
                            <ul className={styles.statList}>
                                <li className={styles.statItem}>
                                    <i className={`fas fa-guitar ${styles.statIcon}`}></i> Lead Guitar
                                </li>
                                <li className={styles.statItem}>
                                    <i className={`fas fa-laptop-code ${styles.statIcon}`}></i> Music Production
                                </li>
                                <li className={styles.statItem}>
                                    <i className={`fas fa-wave-square ${styles.statIcon}`}></i> Sound Design
                                </li>
                                <li className={styles.statItem}>
                                    <i className={`fas fa-sliders-h ${styles.statIcon}`}></i> Mixing/Mastering
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;
