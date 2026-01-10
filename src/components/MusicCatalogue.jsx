import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import styles from './styles/MusicCatalogue.module.css';

const MusicCatalogue = () => {
    const wrapperRef = useRef(null);
    const containerRef = useRef(null);
    const [songs, setSongs] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        // Fetch songs
        fetch('/songs.json')
            .then(res => res.json())
            .then(data => setSongs(data))
            .catch(err => console.error("Failed to load songs", err));
    }, []);

    useEffect(() => {
        if (songs.length === 0 || !wrapperRef.current || !containerRef.current) return;

        const wrapper = wrapperRef.current;
        const container = containerRef.current;

        let x = 0;
        let mouseVelocity = 0;
        let isDragging = false;
        let startX = 0;
        let startScrollX = 0;
        let dragVelocity = 0;
        let lastX = 0;
        const idleVelocity = 0.5;

        // Desktop Mouse Listeners
        const handleMouseMove = (e) => {
            if (isDragging) return;
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const normalizedX = (mouseX / rect.width) * 2 - 1;
            mouseVelocity = normalizedX * 30;
        };

        const handleMouseLeave = () => {
            mouseVelocity = 0;
        };

        const handleTouchStart = (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            startScrollX = x;
            mouseVelocity = 0;
            dragVelocity = 0;
            lastX = startX;
            wrapper.style.willChange = 'transform';
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            x = startScrollX + deltaX;
            dragVelocity = currentX - lastX;
            lastX = currentX;
            gsap.set(wrapper, { x });
        };

        const handleTouchEnd = () => {
            isDragging = false;
            wrapper.style.willChange = 'auto';
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchmove', handleTouchMove);
        container.addEventListener('touchend', handleTouchEnd);

        // Ticker
        const ticker = gsap.ticker.add(() => {
            if (!isDragging) {
                if (Math.abs(dragVelocity) > 0.1) {
                    x += dragVelocity;
                    dragVelocity *= 0.92;
                } else {
                    x -= mouseVelocity || idleVelocity;
                }
            }

            // Wrap logic
            const currentWrapperWidth = wrapper.scrollWidth / 2;
            if (x < -currentWrapperWidth) x += currentWrapperWidth;
            if (x > 0) x -= currentWrapperWidth;

            gsap.set(wrapper, { x });
        });

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
            gsap.ticker.remove(ticker);
        };
    }, [songs]);

    if (songs.length === 0) return null;

    const displaySongs = [...songs, ...songs];

    return (
        <section id="music" className={styles.section} ref={containerRef} data-section-theme="dark">
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className={styles.title}>
                    <span className={styles.titleMain}>RELEASES</span>
                    <span className={styles.titleSub}>CATALOGUE</span>
                </h2>
            </motion.div>

            <div className={styles.catalogueWrapper} ref={wrapperRef}>
                {displaySongs.map((song, i) => (
                    <motion.a
                        key={`${song.title}-${i}`}
                        href={song.streamUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.item}
                        onHoverStart={() => setHoveredIndex(i)}
                        onHoverEnd={() => setHoveredIndex(null)}
                        whileHover={{
                            scale: 1.08,
                            transition: { type: "spring", stiffness: 300, damping: 20 }
                        }}
                    >
                        <img src={song.coverArtUrl} alt={song.title} draggable="false" />
                        <motion.div
                            className={styles.overlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredIndex === i ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className={styles.songTitle}>{song.title}</span>
                            <motion.div
                                className={styles.playIcon}
                                animate={{
                                    scale: hoveredIndex === i ? [1, 1.2, 1] : 1
                                }}
                                transition={{
                                    repeat: hoveredIndex === i ? Infinity : 0,
                                    duration: 1.5
                                }}
                            >
                                <i className="fas fa-play"></i>
                            </motion.div>
                        </motion.div>
                    </motion.a>
                ))}
            </div>

            <motion.div
                className={styles.guidance}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <div className={styles.arrowLeft}></div>
                <span>Hover or drag to explore</span>
                <div className={styles.arrowRight}></div>
            </motion.div>
        </section>
    );
};

export default MusicCatalogue;
