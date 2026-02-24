import React from 'react';
import { motion } from 'framer-motion';
import styles from './styles/NewsletterSection.module.css';

const NewsletterSection = () => {
    return (
        <section id="newsletter" className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className={styles.textContent}>
                        <h2 className={styles.title}>
                            CONNECT
                            <span className={styles.accent}> WITH ME</span>
                        </h2>
                        <p className={styles.description}>
                            Follow my journey, stream my music, and let's collaborate.
                        </p>
                    </div>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    className={styles.socialLinks}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <a href="https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube">
                        <i className="fab fa-youtube"></i>
                    </a>
                    <a href="https://www.instagram.com/kuberbassi.music/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.facebook.com/kuberbassi.music/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="mailto:kuberbassi2007@gmail.com" className={styles.socialIcon} aria-label="Email">
                        <i className="fas fa-envelope"></i>
                    </a>
                </motion.div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>© 2025-{new Date().getFullYear()} Kuber Bassi. Forged in Chords & Soul 🔥</p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
