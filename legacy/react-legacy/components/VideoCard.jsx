import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import styles from './styles/VideoCard.module.css';

const VideoCard = ({ video, onClick, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position for magnetic effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring animations for smooth follow
    const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

    // Transform for rotation
    const rotateX = useTransform(springY, [-50, 50], [5, -5]);
    const rotateY = useTransform(springX, [-50, 50], [-5, 5]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
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
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={() => onClick(video)}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
            }}
        >
            <motion.div
                className={styles.thumbnailWrapper}
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className={styles.thumbnail}
                />
                <motion.div
                    className={styles.playOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className={styles.playButton}
                        animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                        transition={{
                            repeat: isHovered ? Infinity : 0,
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                    >
                        <i className="fas fa-play"></i>
                    </motion.div>
                </motion.div>
            </motion.div>

            <div className={styles.content}>
                <h3 className={styles.title}>{video.title}</h3>
                <div className={styles.meta}>
                    <span className={styles.views}>
                        <i className="fas fa-eye"></i> {video.views}
                    </span>
                    <span className={styles.date}>{video.date}</span>
                </div>
            </div>

            <motion.div
                className={styles.glow}
                animate={{
                    opacity: isHovered ? 0.6 : 0,
                    scale: isHovered ? 1 : 0.8
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
};

export default VideoCard;
