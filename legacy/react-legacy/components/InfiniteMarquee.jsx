import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './styles/InfiniteMarquee.module.css';

const InfiniteMarquee = ({ text = "GUITARIST + PRODUCER + SOUND DESIGN + CREATIVE TECHNOLOGIST + ", speed = 1 }) => {
    const trackRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        // Clone content to ensure seamless loop
        // In React, we render children, here we can manipulate DOM or just render twice in JSX
        // For GSAP seamless loop helper, we need consistent width.

        // Simple seamless loop with GSAP
        const textWidth = track.scrollWidth / 2; // Assuming we render 2 sets

        // Reset position
        gsap.set(track, { x: 0 });

        const animation = gsap.to(track, {
            x: -textWidth, // Move left by half the width (one full set)
            duration: 20 / speed, // Adjust based on length and desired speed
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % textWidth) // Forced loop
            }
        });

        // Optional: Scroll direction change on user scroll
        // Requres ScrollTrigger observer or similar, keep simple smooth for now.

        return () => {
            animation.kill();
        };
    }, [speed, text]);

    return (
        <div className={styles.marqueeContainer} ref={containerRef}>
            <div className={styles.marqueeTrack} ref={trackRef}>
                {/* Render multiple times for safety of filling screen */}
                <span className={styles.marqueeItem}>{text}</span>
                <span className={styles.marqueeItem}>{text}</span>
                <span className={styles.marqueeItem}>{text}</span>
                <span className={styles.marqueeItem}>{text}</span>
            </div>
        </div>
    );
};

export default InfiniteMarquee;
