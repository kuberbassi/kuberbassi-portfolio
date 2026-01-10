import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './styles/VideoModal.module.css';

const VideoModal = ({ video, onClose, onNext, onPrev }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && onPrev) onPrev();
            if (e.key === 'ArrowRight' && onNext) onNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            setMounted(false);
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose, onNext, onPrev]);

    if (!video || !mounted) return null;

    const modalContent = (
        <AnimatePresence>
            <motion.div
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
            >
                {/* Close Button - Independent of modal content */}
                <motion.button
                    className={styles.closeButton}
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                >
                    <i className="fas fa-times"></i>
                </motion.button>

                {/* Left Navigation - Fixed to screen */}
                {onPrev && (
                    <motion.button
                        className={`${styles.navButton} ${styles.prev}`}
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        whileHover={{ scale: 1.2, x: -5, backgroundColor: "rgba(255, 51, 51, 0.4)" }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </motion.button>
                )}

                {/* Right Navigation - Fixed to screen */}
                {onNext && (
                    <motion.button
                        className={`${styles.navButton} ${styles.next}`}
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        whileHover={{ scale: 1.2, x: 5, backgroundColor: "rgba(255, 51, 51, 0.4)" }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </motion.button>
                )}

                <motion.div
                    className={styles.modalContainer}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.videoWrapper}>
                        <iframe
                            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={styles.iframe}
                        />
                    </div>

                    <div className={styles.info}>
                        <h2 className={styles.title}>{video.title}</h2>
                        <div className={styles.meta}>
                            <span className={styles.views}>
                                <i className="fas fa-eye"></i> {Number(video.viewCount).toLocaleString()} VIEWS
                            </span>
                            <span className={styles.date}>{video.date}</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};

export default VideoModal;
