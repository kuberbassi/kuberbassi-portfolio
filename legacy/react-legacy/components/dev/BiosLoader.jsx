import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const keyboardLayout = [
    ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrtSc', 'Del'],
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
    ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Fn', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl', '◁', '↕', '▷']
];

const getFlexBasis = (key) => {
    if (key === 'Space') return 6;
    if (key === 'Shift') return 2.2;
    if (key === 'Enter') return 1.8;
    if (key === 'Caps') return 1.5;
    if (key === 'Tab') return 1.3;
    if (key === 'Backspace') return 1.5;
    if (key === '\\') return 1.2;
    return 1;
};

export const BiosLoader = ({ onComplete }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // CRITICAL FIX: GSAP must own all transforms from frame 1.
            gsap.set('.v4-laptop', { rotationX: 60, transformOrigin: 'center center' });

            const tl = gsap.timeline({ onComplete });

            // 1. Laptop Enters
            tl.from('.v4-laptop', { y: -200, opacity: 0, duration: 1.0, ease: 'power3.out' })
              // 2. Lid opens
              .to('.v4-laptop-lid', { rotationX: 115, duration: 1.2, ease: 'power3.inOut' }, '+=0.0')
              
              // 3. Power Button Click
              .to('.v4-power-btn-container', { z: -2, scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' }, '+=0.1')
              // 4. Power Button Lights up
              .to('.v4-power-btn-icon', { color: '#00ff88', textShadow: '0 0 10px #00ff88', duration: 0.2 }, '-=0.1')
              .to('.v4-power-btn-ring', { borderColor: '#00ff88', boxShadow: '0 0 10px #00ff88, inset 0 0 5px #00ff88', duration: 0.2 }, '<')
              
              // 5. Screen & Gear turn on
              .addLabel('boot')
              .to('.v4-laptop-screen', { opacity: 1, duration: 0.3 }, 'boot+=0.1')
              
              // 6. Screen flashes Full Green + emits glow
              .to('.v4-screen-flash', { opacity: 1, duration: 0.4 }, 'boot+=1.7')
              .to('.v4-laptop-screen', { boxShadow: '0 0 200px 80px rgba(0, 255, 136, 0.8)', duration: 0.4 }, '<')
              
              // Add volumetric ray-traced screen spill over keyboard
              .to('.v4-screen-glow-spill', { opacity: 1, duration: 0.4 }, '<')
              
              // 7. Sleek Exit
              .to('.v4-laptop', { scale: 0.9, y: 50, duration: 0.8, ease: 'power3.inOut' }, 'boot+=1.9')
              .to('.v4-fade-overlay', { opacity: 1, duration: 0.6, ease: 'power2.inOut' }, '<0.1');

        }, containerRef);
        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div ref={containerRef} className="v4-laptop-container">
            {/* Dedicated fade overlay to prevent 3D flattening glitch */}
            <div className="v4-fade-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: '#050505', opacity: 0, zIndex: 50, pointerEvents: 'none' }}></div>
            
            {/* 3D Laptop */}
            <div className="v4-laptop">
                {/* Base & Keyboard */}
                <div className="v4-laptop-base">
                    <div className="v4-laptop-keyboard">
                        {keyboardLayout.map((row, rIdx) => (
                            <div key={rIdx} className="v4-keyboard-row">
                                {row.map((keyLabel, cIdx) => (
                                    <div 
                                        key={cIdx} 
                                        className="v4-laptop-key" 
                                        style={{ flex: getFlexBasis(keyLabel) }}
                                    >
                                        {keyLabel}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="v4-laptop-trackpad"></div>
                    
                    {/* Sleek Power Button */}
                    <div className="v4-power-btn-container">
                        <div className="v4-power-btn-ring"></div>
                        <div className="v4-power-btn-icon">⏻</div>
                    </div>
                    
                    {/* Volumetric Godray Spill */}
                    <div className="v4-screen-glow-spill"></div>
                </div>

                {/* Lid & Screen */}
                <div className="v4-laptop-lid">
                    <div className="v4-laptop-lid-cover"></div>
                    
                    <div className="v4-laptop-screen-container">
                        <div className="v4-laptop-screen">
                            {/* Loading Gear */}
                            <div className="v4-loading-gear"></div>
                            {/* Flash Overlay */}
                            <div className="v4-screen-flash"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BiosLoader;
