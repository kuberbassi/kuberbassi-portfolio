import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './styles/Preloader.module.css';

const Preloader = ({ onComplete, onTransitionStart }) => {
    const containerRef = useRef(null);
    const stageRef = useRef(null);
    const knobWrapperRef = useRef(null);
    const knobBodyRef = useRef(null);
    const knobCapRef = useRef(null);
    const ledRef = useRef(null);
    const indicatorRef = useRef(null);

    // Grid settings
    const [volumeValue, setVolumeValue] = useState(0);
    const [statusText, setStatusText] = useState('STANDBY');

    // Ticks generation constants
    const totalTicks = 31;
    const startAngle = -140;
    const endAngle = 140;

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });

        // Initial States
        gsap.set(knobCapRef.current, { rotation: startAngle });
        gsap.set(indicatorRef.current, { opacity: 0.3 });

        // --- PHASE 1: INITIALIZE ---
        tl.to({}, { duration: 0.5 })
            .call(() => setStatusText('SYSTEM CHECK'))
            .to(ledRef.current, {
                backgroundColor: '#444',
                duration: 0.2
            })
            .to(ledRef.current, {
                backgroundColor: '#ff3333',
                boxShadow: '0 0 15px #ff3333',
                duration: 0.1,
                repeat: 3,
                yoyo: true
            })
            .call(() => setStatusText('READY'))
            .to(indicatorRef.current, { opacity: 1, duration: 0.5 }); // Indicator lights up

        // --- PHASE 2: CRANK IT UP ---
        tl.to({}, { duration: 0.3 })
            .call(() => setStatusText('INCREASING GAIN'))
            .to(knobCapRef.current, {
                rotation: endAngle,
                duration: 2.2,
                ease: "power2.inOut",
                onUpdate: function () {
                    const p = this.progress();
                    setVolumeValue(Math.round(p * 11));
                }
            })

            // --- PHASE 3: MAXIMUM OVERDRIVE SHAKE ---
            .call(() => setStatusText('MAXIMUM LEVEL'))
            .to(stageRef.current, {
                x: "+=3",
                y: "+=3",
                duration: 0.05,
                repeat: 10,
                yoyo: true,
                ease: "none"
            }, "<60%");

        // --- PHASE 4: THE FLUID ZOOM TRANSITION ---
        tl.call(() => {
            if (onTransitionStart) onTransitionStart();
            setStatusText('LIVE');
        })
            .to(ledRef.current, {
                backgroundColor: '#ff0000',
                boxShadow: '0 0 40px #ff0000',
                duration: 0.2
            }, "<") // Immediate red flash
            .to(stageRef.current, {
                scale: 50, // Massive Zoom into the knob
                opacity: 0,
                duration: 1.2,
                ease: "expo.in",
                force3D: true // Ensure GPU acceleration
            })
            .to(containerRef.current, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "<0.2");

    }, [onComplete, onTransitionStart]);

    const renderTicks = () => {
        const ticks = [];
        const rotationRange = endAngle - startAngle;

        for (let i = 0; i < totalTicks; i++) {
            const rot = startAngle + (i * (rotationRange / (totalTicks - 1)));
            const progress = i / (totalTicks - 1);
            const isActive = progress <= volumeValue / 11;

            ticks.push(
                <div
                    key={i}
                    className={`${styles.tick} ${isActive ? styles.tickActive : ''}`}
                    style={{ transform: `translateX(-50%) rotate(${rot}deg)` }}
                />
            );
        }
        return ticks;
    };

    return (
        <div className={styles.preloader} ref={containerRef}>
            <div className={styles.stage} ref={stageRef}>

                {/* 1. Status Bar */}
                <div className={styles.status}>
                    <div className={`${styles.statusDot} ${volumeValue > 0 ? styles.statusDotActive : ''}`} ref={ledRef}></div>
                    <div className={`${styles.statusText} ${volumeValue === 11 ? styles.statusTextActive : ''}`}>
                        {statusText}
                    </div>
                </div>

                {/* 2. The Master Knob */}
                <div className={styles.knobWrapper} ref={knobWrapperRef}>

                    {/* Tick Marks */}
                    <div className={styles.ticksRing}>
                        {renderTicks()}
                    </div>

                    {/* Knob Body (Base) */}
                    <div className={styles.knobBody} ref={knobBodyRef}>
                        {/* Knob Cap (Rotating Part) */}
                        <div className={styles.knobCap} ref={knobCapRef}>
                            <div className={`${styles.indicator} ${volumeValue > 0 ? styles.indicatorActive : ''}`} ref={indicatorRef}></div>
                        </div>
                    </div>

                    {/* Value Number */}
                    <div className={`${styles.value} ${volumeValue === 11 ? styles.valueActive : ''}`}>
                        {volumeValue}
                    </div>
                </div>
            </div>

            <div className={styles.overlay}></div>
        </div>
    );
};

export default Preloader;
