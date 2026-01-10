import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
    const counterRef = useRef(null);
    const logoRef = useRef(null);
    const gateTopRef = useRef(null);
    const gateBottomRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                if (containerRef.current) containerRef.current.style.display = 'none';
                if (onComplete) onComplete();
            }
        });

        const counter = { value: 0 };

        tl.delay(0.5)
            .to(counter, {
                value: 100,
                duration: 2.5,
                ease: "power2.out",
                onUpdate: () => {
                    if (counterRef.current) counterRef.current.textContent = `${Math.round(counter.value)}%`;
                }
            })
            .to(counterRef.current, { opacity: 0, duration: 0.3 }, "-=0.3")
            .to(logoRef.current, { opacity: 1, duration: 1 }, "-=0.3")
            .to(logoRef.current, { duration: 0.8 }) // Hold
            .to(logoRef.current, { opacity: 0, duration: 0.5 })
            .to(gateTopRef.current, { yPercent: -100, ease: "power4.inOut", duration: 1.1 }, "-=0.3")
            .to(gateBottomRef.current, { yPercent: 100, ease: "power4.inOut", duration: 1.1 }, "<");

    }, [onComplete]);

    return (
        <div className="preloader" ref={containerRef} style={{
            position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none'
        }}>
            <div className="preloader-gate-top" ref={gateTopRef} style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '50vh', backgroundColor: '#0a0a0a'
            }}></div>
            <div className="preloader-gate-bottom" ref={gateBottomRef} style={{
                position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50vh', backgroundColor: '#0a0a0a'
            }}></div>

            <div className="preloader-content" style={{
                position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
                <div className="preloader-counter" ref={counterRef} style={{
                    fontSize: 'clamp(3rem, 10vw, 6rem)', color: '#ff0033', transition: 'opacity 0.3s', fontWeight: 'bold'
                }}>0%</div>
                <div className="preloader-logo" ref={logoRef} style={{
                    position: 'absolute', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: '#fff', opacity: 0, left: '50%', top: '63%', transform: 'translate(-50%, -50%)', fontWeight: 'bold'
                }}>KUβER βΔSSI*</div>
            </div>
        </div>
    );
};

export default Preloader;
