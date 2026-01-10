import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const devBgRef = useRef(null);
    const artistBgRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isTouchDevice = !window.matchMedia("(pointer: fine)").matches;

        // Setup Dev Background
        if (devBgRef.current) {
            const container = devBgRef.current;
            container.innerHTML = ''; // Clear previous if any
            const panelRect = container.getBoundingClientRect();
            const gridSize = 40;

            for (let i = 0; i <= panelRect.width / gridSize; i++) {
                const line = document.createElement('div');
                line.classList.add('dev-grid-line', 'vertical');
                line.style.setProperty('--left', `${i * gridSize}px`);
                container.appendChild(line);
            }
            for (let i = 0; i <= panelRect.height / gridSize; i++) {
                const line = document.createElement('div');
                line.classList.add('dev-grid-line', 'horizontal');
                line.style.setProperty('--top', `${i * gridSize}px`);
                container.appendChild(line);
            }

            if (isTouchDevice) {
                const vLines = container.querySelectorAll('.dev-grid-line.vertical');
                const hLines = container.querySelectorAll('.dev-grid-line.horizontal');
                const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });

                tl.to(vLines, {
                    backgroundColor: 'rgba(59, 130, 246, 0.4)',
                    duration: 2,
                    stagger: { amount: 2.5, from: 'random' }
                }).to(hLines, {
                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                    duration: 2,
                    stagger: { amount: 2.5, from: 'center' }
                }, "-=2");
            } else {
                let mouseX = -999, mouseY = -999;
                const handleMouseMove = (e) => {
                    const rect = container.getBoundingClientRect();
                    mouseX = e.clientX - rect.left;
                    mouseY = e.clientY - rect.top;
                };
                const handleMouseLeave = () => {
                    mouseX = -999; mouseY = -999;
                };

                container.addEventListener('mousemove', handleMouseMove);
                container.addEventListener('mouseleave', handleMouseLeave);

                const updateDevGrid = () => {
                    if (!container) return;
                    const lines = container.querySelectorAll('.dev-grid-line');
                    lines.forEach(line => {
                        const isVertical = line.classList.contains('vertical');
                        const linePos = isVertical
                            ? parseFloat(line.style.getPropertyValue('--left'))
                            : parseFloat(line.style.getPropertyValue('--top'));
                        const dist = isVertical ? Math.abs(mouseX - linePos) : Math.abs(mouseY - linePos);

                        let intensity = 0;
                        const radius = 120;
                        if (dist < radius) {
                            intensity = (radius - dist) / radius;
                        }

                        // We use direct style manipulation for performance here, or gsap.set
                        // Using GSAP for consistency with original
                        gsap.to(line, {
                            backgroundColor: `rgba(59, 130, 246, ${0.1 + intensity * 0.4})`,
                            duration: 0.5,
                            ease: 'power1.out',
                            overwrite: 'auto'
                        });
                    });
                    requestAnimationFrame(updateDevGrid);
                };
                updateDevGrid();

                return () => { // Cleanup
                    container.removeEventListener('mousemove', handleMouseMove);
                    container.removeEventListener('mouseleave', handleMouseLeave);
                };
            }
        }

        // Setup Artist Background
        if (artistBgRef.current) {
            const container = artistBgRef.current;
            container.innerHTML = '';
            const numOrbs = 20;

            for (let i = 0; i < numOrbs; i++) {
                const orb = document.createElement('div');
                orb.classList.add('glowing-orb');
                const size = Math.random() * 150 + 50;
                const hue = Math.random() * 60 + 250;
                orb.style.width = `${size}px`;
                orb.style.height = `${size}px`;
                orb.style.left = `${Math.random() * 100}%`;
                orb.style.top = `${Math.random() * 100}%`;
                orb.style.backgroundColor = `hsla(${hue}, 80%, 60%, 0.4)`;
                orb.style.boxShadow = `0 0 ${size / 2}px hsla(${hue}, 80%, 60%, 0.4)`;
                orb.style.filter = `blur(${size / 4}px)`;
                container.appendChild(orb);

                gsap.to(orb, {
                    x: `random(-200, 200)`,
                    y: `random(-200, 200)`,
                    scale: `random(0.8, 1.2)`,
                    duration: `random(15, 25)`,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
            // Fade in handled by CSS typically, or GSAP
            gsap.fromTo(container, { opacity: 0.7 }, { opacity: 1, duration: 0.6 });
        }

    }, []);

    const handleNavigation = (e, path, type) => {
        e.preventDefault();
        const clickedPanel = e.currentTarget.closest('.split-panel');
        const otherPanel = document.querySelector(type === 'dev' ? '.artist-panel' : '.dev-panel');
        const heading = clickedPanel.querySelector('.panel-heading');

        // Simple char split for now
        const chars = heading.innerText.split('').map((char, i) => {
            const span = document.createElement('span');
            span.innerText = char;
            span.style.display = 'inline-block';
            return span;
        });
        heading.innerHTML = '';
        chars.forEach(c => heading.appendChild(c));

        const tl = gsap.timeline({
            onComplete: () => {
                if (path.startsWith('http')) {
                    window.location.href = path; // External link for dev for now
                } else {
                    navigate(path);
                }
            }
        });

        tl.to(otherPanel, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 0)
            .to('.panel-subtext, .landing-footer', { opacity: 0, duration: 0.3 }, 0)
            .to(heading.children, {
                y: () => Math.random() * 400 - 200,
                x: () => Math.random() * 600 - 300,
                scale: 0,
                rotation: () => Math.random() * 360 - 180,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                stagger: 0.02
            }, 0);

        if (type === 'dev') {
            tl.to('.dev-grid-line', {
                scale: 0,
                opacity: 0,
                duration: 1,
                ease: 'expo.out',
                stagger: { amount: 0.5, from: 'center' }
            }, 0.2);
        } else {
            tl.to('.glowing-orb', {
                scale: 0,
                opacity: 0,
                duration: 1,
                ease: 'expo.out',
                stagger: { amount: 0.5, from: 'center' }
            }, 0.2);
        }

        tl.to(clickedPanel, {
            backgroundColor: '#000',
            duration: 1,
            ease: 'power2.inOut'
        }, 0.5);
    };

    return (
        <>
            <main className="split-container active">
                <div className="split-panel dev-panel">
                    <div id="dev-background" ref={devBgRef}></div>
                    {/* For now keeping external link for Dev, or internal if we port it */}
                    <Link to="/dev" className="choice-btn text-btn-glitch" data-text="DEVELOPER">
                        <span className="btn-content">DEVELOPER</span>
                        <span className="btn-glitch-layer"></span>
                        <span className="btn-glitch-layer"></span>
                    </Link>
                </div>

                <div className="split-panel artist-panel">
                    <div id="artist-background" ref={artistBgRef}></div>
                    <a href="/music" onClick={(e) => handleNavigation(e, '/music', 'artist')}>
                        <h2 className="panel-heading">Artist</h2>
                        <span className="panel-subtext">Music & Sound</span>
                    </a>
                </div>
            </main>

            <footer className="landing-footer">
                &copy; 2025 Kuber Bassi
            </footer>
        </>
    );
};

export default LandingPage;
