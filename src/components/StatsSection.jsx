import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './styles/StatsSection.module.css';

const StatsSection = () => {
    const [counts, setCounts] = useState({
        totalStreams: 0,
        releases: 0,
        monthlyListeners: 0
    });

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const stats = [
        { key: 'totalStreams', label: 'Total Streams', target: 500000, suffix: '+', icon: 'fas fa-play' },
        { key: 'releases', label: 'Releases', target: 25, suffix: '', icon: 'fas fa-compact-disc' },
        { key: 'monthlyListeners', label: 'Monthly Listeners', target: 50000, suffix: '+', icon: 'fas fa-headphones' }
    ];

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepDuration = duration / steps;

        stats.forEach(stat => {
            let current = 0;
            const increment = stat.target / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                    current = stat.target;
                    clearInterval(timer);
                }
                setCounts(prev => ({
                    ...prev,
                    [stat.key]: Math.floor(current)
                }));
            }, stepDuration);
        });
    }, [isInView]);

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    };

    return (
        <section id="stats" className={styles.section} ref={ref}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={styles.title}>
                        <span className={styles.titleMain}>BY THE</span>
                        <span className={styles.titleSub}>NUMBERS</span>
                    </h2>
                </motion.div>

                <div className={styles.grid}>
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.key}
                            className={styles.card}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                            }}
                        >
                            <div className={styles.iconWrapper}>
                                <i className={stat.icon}></i>
                            </div>
                            <div className={styles.number}>
                                {formatNumber(counts[stat.key])}{stat.suffix}
                            </div>
                            <div className={styles.label}>{stat.label}</div>
                            <div className={styles.glow}></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
