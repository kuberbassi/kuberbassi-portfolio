import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MainHeader = () => {
    const headerRef = useRef(null);

    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const sections = document.querySelectorAll('section[data-section-theme]');
        sections.forEach(section => {
            const theme = section.getAttribute('data-section-theme');
            if (theme === 'light') {
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top 10%',
                    end: 'bottom 10%',
                    onEnter: () => header.classList.add('header-inverted'),
                    onLeaveBack: () => header.classList.remove('header-inverted'),
                    onLeave: () => header.classList.remove('header-inverted'),
                    onEnterBack: () => header.classList.add('header-inverted'),
                });
            }
        });
    }, []);

    return (
        <header ref={headerRef} className="main-header" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            padding: 'clamp(1.5rem, 1vw, 2.5rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 100,
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            color: '#f2f2f2',
            mixBlendMode: 'difference',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500
        }}>

            <Link to="/" className="logo">KUBER BASSI<span style={{ color: '#ff3333' }}>*</span></Link>

            <div className="status-widget">
                <div className="visualizer">
                    <span></span><span></span><span></span><span></span>
                </div>
                <div className="status-text">
                    STUDIO <span style={{ color: '#ff3333' }}>●</span> LIVE
                </div>
            </div>

            <style>{`
                .header-inverted {
                    color: #0a0a0a !important;
                    mix-blend-mode: normal !important;
                }
                .logo {
                    font-family: 'Anton', sans-serif;
                    text-transform: uppercase;
                    font-size: 1.4rem;
                    text-decoration: none;
                    color: inherit;
                    letter-spacing: 0.05em;
                }
                .status-widget {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.75rem;
                    opacity: 0.8;
                }
                .status-text {
                    letter-spacing: 0.1em;
                }
                .visualizer {
                    display: flex;
                    align-items: flex-end;
                    gap: 3px;
                    height: 15px;
                }
                .visualizer span {
                    width: 3px;
                    background-color: #ff3333;
                    animation: equalize 1s infinite alternate ease-in-out;
                }
                .visualizer span:nth-child(1) { height: 60%; animation-delay: -0.4s; }
                .visualizer span:nth-child(2) { height: 100%; animation-delay: -0.2s; }
                .visualizer span:nth-child(3) { height: 50%; animation-delay: -0.5s; }
                .visualizer span:nth-child(4) { height: 80%; animation-delay: -0.1s; }
                
                @keyframes equalize {
                    0% { height: 20%; }
                    100% { height: 100%; }
                }

                @media (max-width: 768px) {
                    .status-widget { display: none; }
                }
            `}</style>
        </header >
    );
};

export default MainHeader;
