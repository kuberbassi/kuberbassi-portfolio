import React from 'react';
import styles from './styles/ContactSection.module.css';

const ContactSection = () => {
    return (
        <section id="contact" className={styles.section} data-section-theme="dark">
            <div className={styles.content}>
                <h2 className={styles.headline}>LET'S CREATE.</h2>
                <a href="mailto:kuberbassi2007@gmail.com" className={styles.link}>GET IN TOUCH</a>
            </div>
            <div className={styles.bottom}>
                <div className={styles.socials}>
                    <a href="https://open.spotify.com/artist/1hVnV9LmM1EJpA8Gj0iT0H?si=-Hsru793SGSIPv6n41BTug" target="_blank" rel="noreferrer"><i className="fab fa-spotify"></i></a>
                    <a href="https://www.youtube.com/@KuberB" target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>
                    <a href="https://www.instagram.com/kuberbassi.music" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                </div>
                <p className={styles.copyright}>&copy; 2025 KUβER βΔSSI. Forged in Chord & Soul 🔥.</p>
            </div>
        </section>
    );
};

export default ContactSection;
