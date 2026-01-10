import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';
import useYouTubeVideos from '../hooks/useYouTubeVideos';
import styles from './styles/VideosSection.module.css';

const VideosSection = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Fetch videos from YouTube API (or use fallback)
    const { videos, loading, error } = useYouTubeVideos(6);

    const handleVideoClick = (video) => {
        const index = videos.findIndex(v => v.id === video.id);
        setSelectedVideo(video);
        setSelectedIndex(index);
    };

    const handleNext = () => {
        const nextIndex = (selectedIndex + 1) % videos.length;
        setSelectedVideo(videos[nextIndex]);
        setSelectedIndex(nextIndex);
    };

    const handlePrev = () => {
        const prevIndex = (selectedIndex - 1 + videos.length) % videos.length;
        setSelectedVideo(videos[prevIndex]);
        setSelectedIndex(prevIndex);
    };

    return (
        <section id="videos" className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h2 className={styles.title}>
                        <span className={styles.titleMain}>VIDEO</span>
                        <span className={styles.titleSub}>LIBRARY</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Recent performances and studio sessions
                    </p>
                </motion.div>

                <motion.div
                    className={styles.grid}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {videos.map((video, index) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            index={index}
                            onClick={handleVideoClick}
                        />
                    ))}
                </motion.div>

                {/* Link to YouTube channel */}
                <motion.div
                    className={styles.ctaWrapper}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <motion.a
                        href="https://youtube.com/@KuberB"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.ctaButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        <i className="fab fa-youtube"></i>
                        <span>VIEW FULL CHANNEL</span>
                        <i className="fas fa-arrow-right"></i>
                    </motion.a>
                </motion.div>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <VideoModal
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />
            )}
        </section>
    );
};

export default VideosSection;
