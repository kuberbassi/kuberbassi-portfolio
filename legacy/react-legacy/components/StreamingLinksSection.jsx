import React from 'react';
import { motion } from 'framer-motion';
import styles from './styles/StreamingLinksSection.module.css';

const StreamingLinksSection = () => {
    const platforms = [
        {
            name: 'YouTube',
            icon: 'fab fa-youtube',
            url: 'https://www.youtube.com/channel/UCcw12FyihnsK7TEHFBVHApw',
            color: '#FF0000',
            gradient: 'linear-gradient(135deg, #FF0000, #ff3333)'
        },
        {
            name: 'YouTube Music',
            icon: 'fab fa-youtube',
            url: 'https://music.youtube.com/channel/UCnom0oKiYYa_PLEUpczvOVQ',
            color: '#FF0000',
            gradient: 'linear-gradient(135deg, #FF0000, #ff3333)'
        },
        {
            name: 'Apple Music',
            icon: 'fab fa-apple',
            url: 'https://music.apple.com/in/artist/ku%CE%B2er-%CE%B2%CE%B4ssi/1763841556',
            color: '#FA243C',
            gradient: 'linear-gradient(135deg, #FA243C, #ff5a6e)'
        },
        {
            name: 'Amazon Music',
            icon: 'fab fa-amazon',
            url: 'https://music.amazon.in/artists/B0DDQ7M12J',
            color: '#FF9900',
            gradient: 'linear-gradient(135deg, #FF9900, #ffad33)'
        }
    ];

    return (
        <section id="streaming" className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={styles.title}>
                        <span className={styles.titleMain}>STREAM</span>
                        <span className={styles.titleSub}>EVERYWHERE</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Available on all major platforms
                    </p>
                </motion.div>

                <motion.div
                    className={styles.grid}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {platforms.map((platform, index) => (
                        <motion.a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.card}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                            }}
                            whileHover={{
                                scale: 1.05,
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                '--platform-color': platform.color,
                                '--platform-gradient': platform.gradient
                            }}
                        >
                            <div className={styles.iconWrapper}>
                                <i className={platform.icon}></i>
                            </div>
                            <h3 className={styles.platformName}>{platform.name}</h3>
                            <motion.div
                                className={styles.arrow}
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <i className="fas fa-arrow-right"></i>
                            </motion.div>
                            <div className={styles.glow}></div>
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default StreamingLinksSection;
