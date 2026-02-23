import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger, Observer } from 'gsap/all';
import '../styles/DevPortfolioV4.css'; // Global CSS (No Modules)
import KineticCursor from '../components/KineticCursor';
import SEO from '../components/SEO';
import { projects, enrichProjects, getInitialProjects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger, Observer);

// --- SUB-COMPONENTS ---

const TiltCard = ({ children, className }) => {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Tilt Math
        const rotateX = ((y - centerY) / centerY) * -5; // Subtle 5deg
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(cardRef.current, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.01,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)"
        });
    };

    return (
        <div
            ref={cardRef}
            className={`v4-glassCard ${className || ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
};

const TechMarquee = () => {
    const tech = [
        "PYTHON", "REACT", "GSAP", "NODE.JS", "DOCKER", "AWS", "POSTGRES",
        "SYSTEM DESIGN", "NEXT.JS", "THREE.JS", "FIREBASE", "GIT"
    ];

    return (
        <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
            <div className="v4-marqueeTrack">
                {[...tech, ...tech, ...tech].map((item, i) => (
                    <span key={i} style={{ fontSize: '1.2rem', fontFamily: 'Anton', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>
                        {item} •
                    </span>
                ))}
            </div>
        </div>
    );
};

// --- HYPER TEXT (DECODER EFFECT) ---
const HyperText = ({ text, className, style }) => {
    const [display, setDisplay] = useState(text);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@#&";

    const scramble = () => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(
                text
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }
            iteration += 1 / 3;
        }, 30);
    };

    return (
        <span className={className} style={style} onMouseOver={scramble} onLoad={scramble}>
            {display}
        </span>
    );
};

const CyberOverlay = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [latency, setLatency] = useState(12);
    const [uptime, setUptime] = useState(0);
    const [scrollPct, setScrollPct] = useState(0);
    const [fps, setFps] = useState(60);

    useEffect(() => {
        const start = Date.now();

        // Clock + Uptime + Latency
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setUptime(Math.floor((Date.now() - start) / 1000));
            setLatency(Math.max(4, Math.min(28, 12 + Math.round((Math.random() - 0.5) * 8))));
        }, 1000);

        // Scroll depth
        const onScroll = () => {
            const doc = document.documentElement;
            const pct = Math.round((doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100) || 0;
            setScrollPct(pct);
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        // FPS counter
        let frames = 0;
        let lastFps = performance.now();
        let raf;
        const countFps = () => {
            frames++;
            const now = performance.now();
            if (now - lastFps >= 1000) {
                setFps(frames);
                frames = 0;
                lastFps = now;
            }
            raf = requestAnimationFrame(countFps);
        };
        raf = requestAnimationFrame(countFps);

        return () => {
            clearInterval(timer);
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    const fmtUptime = `${String(Math.floor(uptime / 60)).padStart(2, '0')}:${String(uptime % 60).padStart(2, '0')}`;
    const mono = { fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' };

    return (
        <div className="v4-cyberOverlay">
            <div className="v4-scanline"></div>

            {/* TOP LEFT — Identity */}
            <div className="v4-hudCorner top-left" style={{ padding: '10px 0 0 10px', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'Anton', fontSize: '1.2rem', lineHeight: 1 }}>KUBER BASSI</span>
                <span style={{ ...mono, opacity: 0.7 }}>SYSTEM ARCHITECT</span>
            </div>

            {/* TOP RIGHT — Status */}
            <div className="v4-hudCorner top-right" style={{ padding: '20px 40px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <span style={{ ...mono, whiteSpace: 'nowrap' }}>CMD: //ROOT_ACCESS</span>
                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e', animation: 'pulse 2s infinite' }}></div>
            </div>

            {/* BOTTOM LEFT — Telemetry */}
            <div className="v4-hudCorner bottom-left" style={{ padding: '0 0 10px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '2px' }}>
                <span style={mono}>LOC: 28.61° N, 77.20° E</span>
                <span style={{ ...mono, opacity: 0.7 }}>LATENCY: {latency}ms &nbsp;|&nbsp; {fps} FPS</span>
                <span style={{ ...mono, opacity: 0.5 }}>DEPTH: {scrollPct}% &nbsp;|&nbsp; UP {fmtUptime}</span>
            </div>

            {/* BOTTOM RIGHT — Clock */}
            <div className="v4-hudCorner bottom-right" style={{ padding: '0 10px 10px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '1.5rem', fontWeight: 'bold' }}>{time}</span>
                <span style={mono}>SECURE CONNECTION</span>
            </div>
        </div>
    );
}

const InteractiveParticles = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let animationFrameId; // Track animation frame for cleanup

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const count = Math.min(Math.floor(width * height / 35000), 60); // Optimized Density & Hard Cap
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 2
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0, 255, 136, 0.4)';
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.05)';

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Connections
                particles.forEach((p2, j) => {
                    if (j > i) {
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 120) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                });
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="v4-particleCanvas" />;
};

const EnhancedFooter = () => (
    <footer style={{
        position: 'relative',
        padding: '3rem 2rem 1rem',
        background: '#020202',
        borderTop: '1px solid rgba(0, 255, 136, 0.2)',
        overflow: 'hidden',
        marginTop: '3rem'
    }}>
        {/* BACKGROUND GLOW */}
        <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(0, 255, 136, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
        }}></div>

        {/* MARQUEE */}
        <div className="v4-marqueeTrack" style={{ opacity: 0.3, marginBottom: '2rem' }}>
            <span style={{ fontSize: '3rem', fontFamily: 'Anton', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                SYSTEM READY // INITIATE COLLABORATION // SYSTEM READY // INITIATE COLLABORATION //
            </span>
        </div>

        <div className="v4-container">
            <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
                <p style={{ fontFamily: 'JetBrains Mono', color: '#00ff88', marginBottom: '0.5rem' }}>&lt; TRANSMISSION_OPEN /&gt;</p>
                <a href="mailto:kuberbassi2007@gmail.com" className="v4-megaLink" style={{ whiteSpace: 'nowrap' }}>
                    LET'S BUILD THE FUTURE
                </a>
            </div>

            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 'clamp(2rem, 8vw, 6rem)', flexWrap: 'wrap',
                borderTop: '1px solid #111', paddingTop: '2rem',
                fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#666',
                textAlign: 'center', maxWidth: '800px', margin: '0 auto'
            }}>
                <div>
                    <strong style={{ color: '#fff', display: 'block', marginBottom: '1rem' }}>SOCIAL_UPLINK</strong>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <a href="https://github.com/kuberbassi" target="_blank" className="v4-footerIcon"><i className="fab fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/kuberbassi/" target="_blank" className="v4-footerIcon"><i className="fab fa-linkedin"></i></a>
                        <a href="https://www.instagram.com/kuber.bassi/" target="_blank" className="v4-footerIcon"><i className="fab fa-instagram"></i></a>
                        <a href="mailto:kuberbassi2007@gmail.com" className="v4-footerIcon"><i className="fas fa-envelope"></i></a>
                    </div>
                </div>
                <div>
                    <strong style={{ color: '#fff', display: 'block', marginBottom: '1rem' }}>SYSTEM_STATUS</strong>
                    <p><span style={{ color: '#22c55e' }}>●</span> ALL SYSTEMS OPERATIONAL</p>
                    <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#888' }}>
                        Constructing digital reality through clean code and scalable design.
                    </p>
                </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.7rem', opacity: 0.5 }}>
                © 2025-{new Date().getFullYear()} KUBER BASSI. ALL SYSTEMS OPERATIONAL.
            </div>
        </div>

        {/* BACK TO HUB BUBBLE */}
        {/* BACK TO HUB BUBBLE */}
        <a href="/"
            onClick={(e) => {
                e.preventDefault();
                const isLocal = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
                if (isLocal) {
                    window.location.href = '/';
                } else {
                    window.location.href = 'https://kuberbassi.com';
                }
            }}
            style={{
                position: 'fixed',
                bottom: 'max(3rem, env(safe-area-inset-bottom, 3rem))', /* Safe area support */
                left: '50%',
                transform: 'translateX(-50%)',
                width: '70px', /* Increased from 60px */
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.4rem', /* Slightly larger icon */
                textDecoration: 'none',
                zIndex: 9999,
                transition: 'all 0.3s ease',
                boxShadow: '0 0 25px rgba(0,0,0,0.6)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)'; e.currentTarget.style.background = 'rgba(0, 255, 136, 0.8)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(1)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
        >
            <i className="fas fa-home"></i>
        </a>
    </footer>
);


const TerminalWidget = () => {
    return (
        <div className="v4-terminalWidget" style={{ animation: 'fadeIn 2s ease forwards 1s' }}>
            <div className="v4-termHeader">
                <div className="v4-termDot red"></div>
                <div className="v4-termDot yellow"></div>
                <div className="v4-termDot green"></div>
            </div>
            <div className="v4-termLine">
                <span className="v4-termPrompt">kuber@system:~$</span>
                <span>init_protocol --no-legacy --ai-native</span>
            </div>
            <div className="v4-termLine">
                <span className="v4-termPrompt">system:</span>
                <span>Optimizing Neural Networks... [OK]</span>
            </div>
            <div className="v4-termLine">
                <span className="v4-termPrompt">info:</span>
                <span>Contact: kuberbassi2007@gmail.com</span>
            </div>
            <div className="v4-termLine">
                <span className="v4-termPrompt">system:</span>
                <span>Accessing Portfolio... <span className="v4-termCursor"></span></span>
            </div>
        </div>
    );
};

const TerminalNavigator = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [hoveredSection, setHoveredSection] = useState(null);

    const sections = [
        { id: 'hero', label: 'INIT', icon: '>', color: '#00ff88' },
        { id: 'arsenal', label: 'STACK', icon: '$', color: '#8b5cf6' },
        { id: 'about', label: 'CORE', icon: '#', color: '#06b6d4' },
        { id: 'projects', label: 'DEPLOY', icon: '*', color: '#f59e0b' },
        { id: 'contact', label: 'LINK', icon: '@', color: '#22c55e' }
    ];

    useEffect(() => {
        // Use Intersection Observer for accurate section detection
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const getSectionColor = (sectionId) => {
        return sections.find(s => s.id === sectionId)?.color || '#666';
    };

    return (
        <nav className="v4-terminalNav" style={{
            position: 'fixed',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.7rem'
        }}>
            {sections.map((section, index) => {
                const isActive = activeSection === section.id;
                const isHovered = hoveredSection === section.id;
                const nextSection = sections[index + 1];
                const showLine = index < sections.length - 1;
                const lineActive = isActive || activeSection === nextSection?.id;

                return (
                    <div key={section.id} style={{ position: 'relative' }}>
                        {/* CIRCUIT LINE */}
                        {showLine && (
                            <div style={{
                                position: 'absolute',
                                left: '6px',
                                top: '100%',
                                width: '2px',
                                height: '20px',
                                background: lineActive ? section.color : 'rgba(255,255,255,0.15)',
                                boxShadow: lineActive ? `0 0 8px ${section.color}` : 'none',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}></div>
                        )}

                        <button
                            onClick={() => scrollToSection(section.id)}
                            onMouseEnter={() => setHoveredSection(section.id)}
                            onMouseLeave={() => setHoveredSection(null)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: isActive ? `${section.color}10` : 'transparent',
                                border: 'none',
                                color: isActive ? section.color : (isHovered ? '#fff' : '#666'),
                                cursor: 'pointer',
                                padding: '0.5rem',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                textAlign: 'left',
                                borderRadius: '4px',
                                backdropFilter: isActive ? 'blur(10px)' : 'none'
                            }}
                        >
                            {/* NODE DOT - Diamond shape when active */}
                            <div style={{
                                width: isActive ? '14px' : '12px',
                                height: isActive ? '14px' : '12px',
                                borderRadius: '2px',
                                border: `2px solid ${isActive ? section.color : (isHovered ? '#fff' : '#666')}`,
                                background: isActive ? section.color : 'transparent',
                                boxShadow: isActive ? `0 0 15px ${section.color}, inset 0 0 5px ${section.color}` : 'none',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: isActive ? 'rotate(45deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                                position: 'relative'
                            }}>
                                {/* Pulse effect when active */}
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        inset: '-4px',
                                        border: `1px solid ${section.color}`,
                                        borderRadius: '2px',
                                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                        opacity: 0.5
                                    }}></div>
                                )}
                            </div>

                            {/* LABEL - Expandable */}
                            <span style={{
                                opacity: isActive || isHovered ? 1 : 0,
                                maxWidth: isActive || isHovered ? '100px' : '0',
                                overflow: 'hidden',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                whiteSpace: 'nowrap',
                                textShadow: isActive ? `0 0 10px ${section.color}` : 'none',
                                fontWeight: isActive ? 'bold' : 'normal',
                                letterSpacing: '0.05em'
                            }}>
                                {section.icon} {section.label}
                            </span>
                        </button>
                    </div>
                );
            })}
        </nav>
    );
};

const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = (window.scrollY / documentHeight) * 100;
            setProgress(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return <div className="v4-scrollProgress" style={{ width: `${progress}%` }}></div>;
};

const BiosLoader = ({ onComplete }) => {
    const containerRef = useRef(null);
    const [lines, setLines] = useState([]);
    const [phase, setPhase] = useState(0);

    const bootLines = [
        '> BIOS v4.2.1 ... OK',
        '> Memory check .......... 32GB',
        '> GPU: RTX Pipeline online',
        '> Loading kernel modules',
        '> Mounting /dev/portfolio',
        '> Establishing secure tunnel',
        '> AUTH: fingerprint verified',
        '> SYSTEM READY'
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ onComplete });

            // P1: GRID + SCANLINE ACTIVATION
            tl.to('.bl-grid', { opacity: 0.15, duration: 0.4, ease: 'power2.in' })
                .to('.bl-scanline', { opacity: 1, duration: 0.2 }, 0);

            // P2: TERMINAL TYPE
            tl.call(() => setPhase(1), [], 0.3);
            bootLines.forEach((_, i) => {
                tl.call(() => setLines(prev => [...prev, bootLines[i]]), [], 0.3 + i * 0.18);
            });

            // P3: WIREFRAME GEOMETRY
            tl.call(() => setPhase(2), [], 1.2)
                .from('.bl-hex', { scale: 0, rotation: -180, opacity: 0, duration: 1.0, ease: 'expo.out' }, 1.2)
                .from('.bl-hex-inner', { scale: 0, rotation: 180, opacity: 0, duration: 0.8, ease: 'back.out(2)' }, 1.5)
                .from('.bl-orbit', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, 1.6)

                // P4: NAME SLAM
                .call(() => setPhase(3), [], 2.2)
                .fromTo('.bl-name', {
                    scale: 3, opacity: 0, letterSpacing: '40px', filter: 'blur(20px)'
                }, {
                    scale: 1, opacity: 1, letterSpacing: '12px', filter: 'blur(0px)',
                    duration: 0.6, ease: 'expo.out'
                }, 2.2)
                .to('.bl-name', { x: -8, skewX: -10, duration: 0.05 }, 2.8)
                .to('.bl-name', { x: 6, skewX: 8, duration: 0.05 }, 2.85)
                .to('.bl-name', { x: 0, skewX: 0, duration: 0.05 }, 2.9)

                // P5: SUBTITLE
                .fromTo('.bl-sub', {
                    opacity: 0, y: 10, letterSpacing: '15px'
                }, {
                    opacity: 0.6, y: 0, letterSpacing: '6px',
                    duration: 0.4, ease: 'power2.out'
                }, 2.95)

                // P6: IRIS WIPE EXIT
                .to('.bl-terminal', { opacity: 0, y: -20, duration: 0.3 }, 3.2)
                .to('.bl-geo', { scale: 0.5, opacity: 0, rotation: 90, duration: 0.4 }, 3.2)
                .to(containerRef.current, {
                    clipPath: 'circle(0% at 50% 50%)',
                    duration: 0.6, ease: 'power3.inOut'
                }, 3.4);

        }, containerRef);
        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div ref={containerRef} style={{
            position: 'fixed', inset: 0, background: '#030303', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            clipPath: 'circle(150% at 50% 50%)', overflow: 'hidden',
            fontFamily: 'JetBrains Mono, monospace'
        }}>
            {/* BACKGROUND GRID */}
            <div className="bl-grid" style={{
                position: 'absolute', inset: 0, opacity: 0,
                backgroundImage: `linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
            }} />

            {/* SCANLINE */}
            <div className="bl-scanline" style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
                opacity: 0, boxShadow: '0 0 30px #00ff88, 0 0 60px #00ff88',
                animation: phase >= 1 ? 'blScanDown 2s linear infinite' : 'none'
            }} />

            {/* TERMINAL BLOCK */}
            <div className="bl-terminal" style={{
                position: 'absolute', top: '8%', left: '6%',
                display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '500px'
            }}>
                {lines.map((line, i) => (
                    <div key={i} style={{
                        fontSize: '0.72rem',
                        color: i === lines.length - 1 ? '#00ff88' : 'rgba(0,255,136,0.4)',
                        letterSpacing: '1px', lineHeight: 1.8,
                        borderLeft: i === lines.length - 1 ? '2px solid #00ff88' : 'none',
                        paddingLeft: i === lines.length - 1 ? '8px' : '0'
                    }}>
                        {line}
                    </div>
                ))}
                {phase >= 1 && phase < 3 && (
                    <span style={{ display: 'inline-block', width: '8px', height: '16px', background: '#00ff88', animation: 'blBlink 0.8s step-end infinite' }} />
                )}
            </div>

            {/* CENTER GEOMETRY */}
            <div className="bl-geo" style={{ position: 'relative', width: '280px', height: '280px' }}>
                <div className="bl-hex" style={{
                    position: 'absolute', inset: 0,
                    border: '1.5px solid rgba(0,255,136,0.4)', borderRadius: '50%',
                    animation: phase >= 2 ? 'blSpin 8s linear infinite' : 'none'
                }} />
                <div className="bl-hex-inner" style={{
                    position: 'absolute', inset: '30px',
                    border: '1px solid rgba(0,255,136,0.25)', borderRadius: '50%',
                    animation: phase >= 2 ? 'blSpin 6s linear infinite reverse' : 'none'
                }} />
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <div key={`orbit-${i}`} className="bl-orbit" style={{
                        position: 'absolute', width: '6px', height: '6px',
                        background: '#00ff88', borderRadius: '50%',
                        top: '50%', left: '50%',
                        transform: `rotate(${deg}deg) translateX(140px) translateY(-50%)`,
                        boxShadow: '0 0 12px #00ff88'
                    }} />
                ))}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '20px', height: '1px', background: 'rgba(0,255,136,0.5)', transform: 'translate(-50%, -50%)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '1px', height: '20px', background: 'rgba(0,255,136,0.5)', transform: 'translate(-50%, -50%)' }} />
            </div>

            {/* NAME + SUBTITLE */}
            <div style={{
                position: 'absolute', bottom: '22%', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem'
            }}>
                <h1 className="bl-name" style={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
                    color: '#fff', textTransform: 'uppercase',
                    opacity: 0, letterSpacing: '12px', lineHeight: 1,
                    textShadow: '0 0 40px rgba(0,255,136,0.4), 0 0 80px rgba(0,255,136,0.15)',
                    margin: 0
                }}>KUBER BASSI</h1>
                <span className="bl-sub" style={{
                    fontSize: '0.85rem', color: '#00ff88',
                    letterSpacing: '6px', textTransform: 'uppercase',
                    opacity: 0, fontWeight: 300
                }}>SYSTEM ARCHITECT</span>
            </div>

            {/* Bottom status */}
            <div className="bl-status" style={{
                position: 'absolute', bottom: '4%', left: 0, right: 0,
                display: 'flex', justifyContent: 'center', gap: '3rem',
                fontSize: '0.6rem', color: 'rgba(0,255,136,0.3)', letterSpacing: '2px'
            }}>
                <span>SEC://TLS-1.3</span>
                <span>NODE://DELHI</span>
                <span>BUILD://V4.2</span>
            </div>

            <style>{`
                @keyframes blScanDown { 0% { top: -3px; } 100% { top: 100%; } }
                @keyframes blBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                @keyframes blSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 768px) {
                    .bl-terminal { 
                        top: 5% !important; 
                        left: 5% !important; 
                        max-width: 80% !important; 
                    }
                    .bl-geo { 
                        transform: scale(0.75); 
                    }
                    .bl-name { 
                        font-size: clamp(1.8rem, 10vw, 3.5rem) !important; 
                        letter-spacing: 6px !important; 
                    }
                    .bl-sub { 
                        font-size: 0.7rem !important; 
                        letter-spacing: 3px !important; 
                    }
                    .bl-status {
                        gap: 1.5rem !important;
                        font-size: 0.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};


const DevPortfolio = () => {
    const [loading, setLoading] = useState(() => {
        // Show intro only if this is a new session (new tab or browser refresh)
        return !sessionStorage.getItem('portfolioVisited');
    });
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [projectData, setProjectData] = useState(() => getInitialProjects(projects));
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const mainRef = useRef(null);
    const heroTextRef = useRef(null);
    const artifactRef = useRef(null);
    const carouselRef = useRef(null);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    // --- GitHub Metadata Automation ---
    useEffect(() => {
        const fetchGitHubData = async () => {
            const cacheKey = 'v4_github_cache';
            const cached = localStorage.getItem(cacheKey);
            const now = Date.now();

            if (cached) {
                try {
                    const { data, timestamp } = JSON.parse(cached);
                    if (now - timestamp < 3600000) {
                        setProjectData(data);
                        return;
                    }
                } catch (e) { console.error("Cache parse failed:", e); }
            }

            try {
                const enriched = await enrichProjects(projects);
                setProjectData(enriched);
                localStorage.setItem(cacheKey, JSON.stringify({ data: enriched, timestamp: now }));
            } catch (err) { console.error("GitHub fetch failed:", err); }
        };

        if (!loading) fetchGitHubData();
    }, [loading]);

    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            gsap.config({ force3D: true });

            // 1. HERO ENTRANCE
            const tl = gsap.timeline({
                onComplete: () => ScrollTrigger.refresh()
            });
            tl.from('.v4-monolithText', { y: 150, opacity: 0, duration: 2.5, ease: "elastic.out(1, 0.4)", stagger: 0.12 })
                .from('.v4-cube', { scale: 0, rotation: 720, opacity: 0, duration: 3, ease: "back.out(1.4)" }, "-=2");

            // 2. MAGNETIC TEXT EFFECT
            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;
                const x = (clientX / innerWidth - 0.5) * 2;
                const y = (clientY / innerHeight - 0.5) * 2;
                gsap.to(heroTextRef.current, { x: x * 30, y: y * 30, duration: 1.2, ease: "power2.out" });
                gsap.to(artifactRef.current, { x: -x * 20, y: -y * 20, rotationY: x * 15, rotationX: -y * 15, duration: 1.8, ease: "power2.out" });
            };
            window.addEventListener('mousemove', handleMouseMove);

            // 3. GENERIC REVEAL (REVEAL-FADE-UP)
            gsap.utils.toArray('.reveal-fade-up').forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out'
                });
            });

            // 4. STACK PILLS REVEAL (no reveal-fade-up on rows — direct per-pill animation)
            gsap.utils.toArray('.v4-stackPill, .v4-stackTag').forEach((pill, i) => {
                gsap.fromTo(pill,
                    { opacity: 0, y: 20, scale: 0.92 },
                    {
                        scrollTrigger: {
                            trigger: pill,
                            start: 'top 95%',
                            toggleActions: 'play none none none'
                        },
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        delay: (i % 8) * 0.04,
                        ease: 'back.out(1.4)'
                    }
                );
            });

        }, mainRef);

        return () => ctx.revert();
    }, [loading]);

    // Step-based carousel navigation
    const activeIndexRef = useRef(0);
    activeIndexRef.current = activeIndex;

    const goToCard = useCallback((idx) => {
        if (!wrapperRef.current || !carouselRef.current || projectData.length === 0) return;
        const clamped = Math.max(0, Math.min(idx, projectData.length - 1));
        setActiveIndex(clamped);
        setFlippedIndex(null); // unflip when navigating

        const cards = wrapperRef.current.querySelectorAll('.v4-projectCardNew');
        if (!cards[clamped]) return;

        const containerW = carouselRef.current.offsetWidth;
        const card = cards[clamped];
        const cardOffset = card.offsetLeft + card.offsetWidth / 2;
        const targetX = -(cardOffset - containerW / 2);

        gsap.to(wrapperRef.current, {
            x: targetX,
            duration: 0.7,
            ease: 'power3.out'
        });
    }, [projectData.length]);

    // Keyboard navigation (uses ref to avoid re-registering on every activeIndex change)
    useEffect(() => {
        if (loading || projectData.length === 0) return;

        const handleKey = (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); goToCard(activeIndexRef.current + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); goToCard(activeIndexRef.current - 1); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [loading, projectData.length, goToCard]);

    // Center first card on initial load
    useEffect(() => {
        if (!loading && projectData.length > 0) {
            requestAnimationFrame(() => goToCard(0));
        }
    }, [loading, projectData.length, goToCard]);

    const handleIntroComplete = () => {
        sessionStorage.setItem('portfolioVisited', 'true');
        setLoading(false);
    };



    return (
        <>
            {loading && <BiosLoader onComplete={handleIntroComplete} />}
            <div className="v4-container" ref={mainRef} style={{ visibility: loading ? 'hidden' : 'visible', height: loading ? '100vh' : 'auto', overflow: 'hidden' }}>
                <SEO
                    title="KUBER BASSI | System Architect & Developer"
                    description="Full-stack developer specializing in React, Node.js, and modern web technologies. Explore my projects showcasing cutting-edge development and system design."
                    keywords="Kuber Bassi, developer, software engineer, full-stack, React, Node.js, Python, web development, system architect"
                    ogType="website"
                    url="https://dev.kuberbassi.com"
                />
                {/* SCROLL PROGRESS BAR */}
                <ScrollProgress />

                {/* TERMINAL SIDE NAVIGATOR */}
                <TerminalNavigator />

                <KineticCursor />
                <InteractiveParticles />
                <CyberOverlay />
                <div className="v4-noise"></div>
                <div className="v4-bgGrid"></div>

                {/* HERO */}
                <section id="hero" className="v4-heroSection">
                    <div className="v4-artifactWrapper" ref={artifactRef}>
                        <div className="v4-cube">
                            <div className="v4-face v4-faceFront"></div>
                            <div className="v4-face v4-faceBack"></div>
                            <div className="v4-face v4-faceRight"></div>
                            <div className="v4-face v4-faceLeft"></div>
                            <div className="v4-face v4-faceTop"></div>
                            <div className="v4-face v4-faceBottom"></div>
                        </div>
                    </div>
                    <div className="v4-heroContent" ref={heroTextRef}>
                        <h1 className="v4-monolithText"><HyperText text="SYSTEM" /></h1>
                        <h1 className="v4-monolithText" style={{ color: '#00ff88' }}><HyperText text="ARCHITECT" /></h1>
                        <span className="v4-monolithSub">AI-Native // Python // System Design</span>
                    </div>
                    <TerminalWidget />
                </section>

                {/* ARSENAL (STACK) SECTION */}
                <section id="arsenal" className="v4-stackSection">
                    <div className="v4-stackInner">
                        <h2 className="v4-sectionHeading reveal-fade-up" style={{ textAlign: 'left', margin: '0 0 1rem 0' }}><HyperText text="THE ARSENAL" /></h2>
                        <p className="v4-stackSubtitle reveal-fade-up">A full-spectrum developer — from systems to strategy.</p>

                        {/* ROW 1: Languages */}
                        <div className="v4-stackRow">
                            <span className="v4-stackRowLabel">Languages</span>
                            <div className="v4-stackPills">
                                {[
                                    { name: "JavaScript", icon: "javascript/javascript-original.svg" },
                                    { name: "TypeScript", icon: "typescript/typescript-original.svg" },
                                    { name: "Python", icon: "python/python-original.svg" },
                                    { name: "C", icon: "c/c-original.svg" },
                                    { name: "HTML5", icon: "html5/html5-original.svg" },
                                    { name: "CSS3", icon: "css3/css3-original.svg" },
                                    { name: "SQL", icon: "postgresql/postgresql-original.svg" }
                                ].map(tech => (
                                    <div className="v4-stackPill" key={tech.name}>
                                        <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}`} alt={tech.name} />
                                        <span>{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ROW 2: Frameworks & Data */}
                        <div className="v4-stackRow">
                            <span className="v4-stackRowLabel">Frameworks &amp; Data</span>
                            <div className="v4-stackPills">
                                {[
                                    { name: "React", icon: "react/react-original.svg" },
                                    { name: "React Native", icon: "react/react-original.svg", style: { filter: "hue-rotate(180deg)" } },
                                    { name: "Node.js", icon: "nodejs/nodejs-original.svg" },
                                    { name: "Express", icon: "express/express-original.svg", style: { filter: "invert(1)" } },
                                    { name: "Flask", icon: "flask/flask-original.svg", style: { filter: "invert(1)" } },
                                    { name: "MongoDB", icon: "mongodb/mongodb-original.svg" },
                                    { name: "PostgreSQL", icon: "postgresql/postgresql-original.svg" },
                                    { name: "Firebase", icon: "firebase/firebase-plain.svg" }
                                ].map(tech => (
                                    <div className="v4-stackPill" key={tech.name}>
                                        <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}`} alt={tech.name} style={tech.style} />
                                        <span>{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ROW 3: Infrastructure */}
                        <div className="v4-stackRow">
                            <span className="v4-stackRowLabel">Infrastructure</span>
                            <div className="v4-stackPills">
                                {[
                                    { name: "Docker", icon: "docker/docker-original.svg" },
                                    { name: "AWS", icon: "amazonwebservices/amazonwebservices-original-wordmark.svg", style: { filter: "invert(1)" } },
                                    { name: "Vercel", icon: "vercel/vercel-original.svg", style: { filter: "invert(1)" } },
                                    { name: "Git", icon: "git/git-original.svg" },
                                    { name: "GitHub", icon: "github/github-original.svg", style: { filter: "invert(1)" } },
                                    { name: "Cloudflare", icon: "cloudflare/cloudflare-original.svg" }
                                ].map(tech => (
                                    <div className="v4-stackPill" key={tech.name}>
                                        <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}`} alt={tech.name} style={tech.style} />
                                        <span>{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ROW 4: Mindset & Craft */}
                        <div className="v4-stackRow">
                            <span className="v4-stackRowLabel">Expertise</span>
                            <div className="v4-stackPills">
                                {["System Architecture", "AI Prompt Engineering", "Cybersecurity", "Zero Trust", "Legacy Optimization", "Scalable UI/UX"].map(tag => (
                                    <span key={tag} className="v4-stackTag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SYSTEM CORE (PRINCIPLES) --- */}
                <section className="v4-coreSection" id="about">
                    <h2 className="v4-sectionHeading reveal-fade-up"><HyperText text="SYSTEM CORE" /></h2>
                    <div className="v4-coreGrid">
                        {[
                            {
                                icon: "⚡",
                                title: "FULL-STACK DEVELOPMENT",
                                desc: "Focused on building responsive applications using modern frameworks. Currently mastering JavaScript and Backend Logic to create seamless user experiences and efficient data handling."
                            },
                            {
                                icon: "🛡️",
                                title: "SYSTEMS & AUTOMATION",
                                desc: "Developing custom scripts to automate repetitive tasks and optimize PC workflows. Interested in System-level efficiency and creating tools that bridge the gap between hardware and software."
                            },
                            {
                                icon: "💎",
                                title: "ALGORITHMIC THINKING",
                                desc: "Applying data-driven logic to solve complex problems in hackathons and technical challenges. Specialized in Rapid Prototyping and leading technical teams to deliver functional solutions under pressure."
                            }
                        ].map((core, i) => (
                            <div
                                className="v4-holoCard"
                                key={i}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                                    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                                    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                                }}
                            >
                                <div className="v4-holoIcon">{core.icon}</div>
                                <h3 style={{ fontFamily: 'Anton', fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', letterSpacing: '1px' }}>{core.title}</h3>
                                <p style={{ color: '#aaa', lineHeight: 1.6, fontSize: '1.1rem', fontWeight: 300 }}>{core.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PROJECT DECK (HORIZONTAL CAROUSEL) */}
                <section className="v4-carouselSection" id="projects">
                    <h2 className="v4-sectionHeading reveal-fade-up">
                        <HyperText text="DEPLOYMENTS" />
                    </h2>

                    <div className="v4-carouselContainer" ref={carouselRef}>
                        <div className="v4-carouselTrack" ref={wrapperRef}>
                            {projectData.map((proj, i) => (
                                <div
                                    className={`v4-projectCardNew ${flippedIndex === i ? 'is-flipped' : ''} ${activeIndex === i ? 'is-active' : ''}`}
                                    key={`${proj.projectId}-${i}`}
                                    onClick={() => {
                                        if (activeIndex !== i) { goToCard(i); }
                                        else { setFlippedIndex(flippedIndex === i ? null : i); }
                                    }}
                                >
                                    <div className="v4-cardInner">
                                        {/* FRONT SIDE - Premium Credit Card */}
                                        <div className={`v4-cardFront ${proj.cardClass}`}>
                                            <div className="v4-cardHeader">
                                                <div className="v4-cardProvider">{proj.title}</div>
                                                <div className="v4-cardChip"></div>
                                            </div>

                                            <div className="v4-cardNumber">
                                                {proj.projectId}
                                            </div>

                                            <div className="v4-cardFooter">
                                                <div className="v4-cardHolder">
                                                    <span className="v4-expiryLabel">LEVEL</span>
                                                    {proj.stat}
                                                </div>
                                                <div className="v4-cardExpiry">
                                                    <span className="v4-expiryLabel">BUILD</span>
                                                    <span className="v4-expiryValue">{proj.version}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* BACK SIDE */}
                                        <div className={`v4-cardBack ${proj.cardClass}`}>
                                            <div className="v4-cardBackHeader">
                                                <span className="v4-cardBackTitle">{proj.title}</span>
                                                <span className="v4-cardBackBadge">{proj.language || proj.stat}</span>
                                            </div>
                                            <div className="v4-cardDesc">
                                                <p>{proj.desc}</p>
                                                <div className="v4-cardActions">
                                                    <button
                                                        className="v4-cardBtn v4-cardBtn--primary"
                                                        onClick={(e) => { e.stopPropagation(); window.open(proj.link, '_blank'); }}
                                                    >
                                                        LIVE DEMO →
                                                    </button>
                                                    <button
                                                        className="v4-cardBtn v4-cardBtn--ghost"
                                                        onClick={(e) => { e.stopPropagation(); window.open(proj.github, '_blank'); }}
                                                    >
                                                        SOURCE
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nav Arrows + Dots */}
                    <div className="v4-carouselNav">
                        <button className="v4-navArrow" onClick={() => goToCard(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Previous project">
                            ←
                        </button>
                        <div className="v4-carouselDots">
                            {projectData.map((_, i) => (
                                <button
                                    key={i}
                                    className={`v4-carouselDot ${activeIndex === i ? 'active' : ''}`}
                                    onClick={() => goToCard(i)}
                                    aria-label={`Go to project ${i + 1}`}
                                />
                            ))}
                        </div>
                        <button className="v4-navArrow" onClick={() => goToCard(activeIndex + 1)} disabled={activeIndex === projectData.length - 1} aria-label="Next project">
                            →
                        </button>
                    </div>
                    <p className="v4-carouselHint">Use ← → arrow keys or click to navigate &nbsp;·&nbsp; Click active card to flip</p>

                </section>

                {/* Footer */}
                <section id="contact">
                    <EnhancedFooter />
                </section>

            </div >
        </>
    );
};

export default DevPortfolio;
