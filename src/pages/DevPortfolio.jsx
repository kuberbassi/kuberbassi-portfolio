import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Observer from 'gsap/Observer'; // Fixed Default Import
import '../styles/DevPortfolioV4.css'; // Global CSS (No Modules)
import KineticCursor from '../components/KineticCursor';

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

const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeString = time.toLocaleTimeString('en-US', options);

    return <h2 className="v4-cardTitle">{timeString}</h2>;
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

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="v4-cyberOverlay">
            <div className="v4-scanline"></div>

            {/* CORNER WIDGETS */}
            <div className="v4-hudCorner top-left" style={{ padding: '10px 0 0 10px', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'Anton', fontSize: '1.2rem', lineHeight: 1 }}>KUBER BASSI</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', opacity: 0.7 }}>SYSTEM ARCHITECT</span>
            </div>

            <div className="v4-hudCorner top-right" style={{
                padding: '20px 40px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '10px'
            }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>CMD: //ROOT_ACCESS</span>
                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }}></div>
            </div>

            <div className="v4-hudCorner bottom-left" style={{ padding: '0 0 10px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>LOC: 28.61° N, 77.20° E</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', opacity: 0.7 }}>LATENCY: 12ms</span>
            </div>

            <div className="v4-hudCorner bottom-right" style={{ padding: '0 10px 10px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '1.5rem', fontWeight: 'bold' }}>{time}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>SECURE CONNECTION</span>
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
            const count = Math.floor(width * height / 20000); // Optimized Density
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
            ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';

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
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        overflow: 'hidden',
        marginTop: '3rem'
    }}>
        {/* BACKGROUND GLOW */}
        <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
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
                <p style={{ fontFamily: 'JetBrains Mono', color: '#3b82f6', marginBottom: '0.5rem' }}>&lt; TRANSMISSION_OPEN /&gt;</p>
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
        <Link to="/" style={{
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '1.2rem', textDecoration: 'none',
            zIndex: 100, transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)'; e.currentTarget.style.background = 'rgba(59, 130, 246, 0.8)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(1)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
        >
            <i className="fas fa-home"></i>
        </Link>
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
        { id: 'hero', label: 'INIT', icon: '>', color: '#3b82f6' },
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
        <nav style={{
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
    const textRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ onComplete });

            // PHASE 1: VOID AWAKENING - Multiple expanding rings (faster)
            tl.set(containerRef.current, { background: '#000' })
                .from('.v4-ring', {
                    scale: 0,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: 'expo.out'
                })
                .to('.v4-ring', {
                    scale: 30,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.in'
                }, "+=0.1")

                // PHASE 2: PARTICLE GENESIS (faster burst)
                .from('.v4-particle', {
                    scale: 0,
                    opacity: 0,
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    stagger: {
                        from: 'center',
                        amount: 0.4,
                        grid: [10, 10]
                    },
                    ease: 'power4.out'
                }, "-=0.3")

                // PHASE 3: CODE MATRIX (quicker flash)
                .from('.v4-codeChar', {
                    y: -100,
                    opacity: 0,
                    duration: 0.4,
                    stagger: {
                        amount: 0.5,
                        from: 'random'
                    },
                    ease: 'none'
                }, "-=0.6")
                .to('.v4-codeChar', {
                    opacity: 0,
                    duration: 0.3
                }, "+=0.1")

                // PHASE 4: TITLE EMERGENCE (punchy reveal)
                .set(textRef.current, { opacity: 1 })
                .from(textRef.current, {
                    scale: 0.5,
                    rotationX: -90,
                    z: -1000,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                })
                .from('.v4-titleChar', {
                    y: 100,
                    opacity: 0,
                    rotation: 360,
                    duration: 0.5,
                    stagger: 0.03,
                    ease: 'elastic.out(1, 0.5)'
                }, "-=0.6")

                // PHASE 5: ENERGY WAVES (quick sweep)
                .from('.v4-wave', {
                    scaleX: 0,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                }, "-=0.4")

                // PHASE 6: FINAL COLLAPSE (fast exit)
                .to(containerRef.current, {
                    clipPath: 'circle(0% at 50% 50%)',
                    duration: 0.8,
                    ease: 'power4.inOut',
                    delay: 0.2
                });

            // Progress animation (reduced to 3 seconds total)
            tl.to({}, {
                duration: 3,
                onUpdate: function () {
                    setProgress(Math.round(this.progress() * 100));
                }
            }, 0);

        }, containerRef);

        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div ref={containerRef} style={{
            position: 'fixed', inset: 0, background: '#000', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            clipPath: 'circle(150% at 50% 50%)', perspective: '1000px'
        }}>
            {/* EXPANDING RINGS */}
            {[...Array(5)].map((_, i) => (
                <div key={`ring-${i}`} className="v4-ring" style={{
                    position: 'absolute', width: '50px', height: '50px',
                    border: '2px solid #3b82f6', borderRadius: '50%',
                    boxShadow: `0 0 ${20 + i * 10}px #3b82f6`
                }}></div>
            ))}

            {/* PARTICLE FIELD */}
            {[...Array(100)].map((_, i) => (
                <div key={`particle-${i}`} className="v4-particle" style={{
                    position: 'absolute',
                    width: '3px', height: '3px',
                    background: i % 3 === 0 ? '#3b82f6' : '#fff',
                    borderRadius: '50%',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: '0 0 5px currentColor'
                }}></div>
            ))}

            {/* CODE MATRIX */}
            {[...Array(50)].map((_, i) => (
                <div key={`code-${i}`} className="v4-codeChar" style={{
                    position: 'absolute',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontFamily: 'JetBrains Mono',
                    color: '#3b82f6',
                    fontSize: '1.5rem',
                    opacity: 0.5
                }}>
                    {String.fromCharCode(48 + Math.floor(Math.random() * 75))}
                </div>
            ))}

            {/* MAIN TITLE */}
            <h1 ref={textRef} style={{
                fontFamily: 'Anton',
                fontSize: 'clamp(3rem, 10vw, 7rem)',
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '10px',
                opacity: 0,
                position: 'relative',
                zIndex: 100,
                textShadow: '0 0 30px #3b82f6, 0 0 60px #3b82f6',
                transformStyle: 'preserve-3d'
            }}>
                {'SYSTEM ARCHITECT'.split('').map((char, i) => (
                    <span key={i} className="v4-titleChar" style={{ display: 'inline-block' }}>
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </h1>

            {/* ENERGY WAVES */}
            {[0, 1, 2].map(i => (
                <div key={`wave-${i}`} className="v4-wave" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, #3b82f6, transparent)`,
                    top: `${40 + i * 10}%`,
                    boxShadow: '0 0 20px #3b82f6'
                }}></div>
            ))}

            {/* LOADING BAR */}
            <div style={{
                position: 'absolute',
                bottom: '10%',
                width: '60%',
                height: '4px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                    boxShadow: '0 0 20px #3b82f6',
                    transition: 'width 0.1s ease'
                }}></div>
            </div>

            {/* LOADING TEXT */}
            <div style={{
                position: 'absolute',
                bottom: '6%',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.9rem',
                color: '#3b82f6',
                letterSpacing: '3px'
            }}>
                INITIALIZING SYSTEM... {progress}%
            </div>
        </div>
    );
};


const DevPortfolio = () => {
    const [loading, setLoading] = useState(() => {
        // Show intro only if this is a new session (new tab or browser refresh)
        return !sessionStorage.getItem('portfolioVisited');
    });
    const mainRef = useRef(null);
    const heroTextRef = useRef(null);
    const artifactRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Set page title - matches format
        document.title = "KUBER BASSI | System Architect";

        if (loading) return; // Wait for loader

        const ctx = gsap.context(() => {
            // 1. HERO ENTRANCE (BOUNCY FLUIDITY)
            const tl = gsap.timeline();
            tl.from('.v4-monolithText', { y: 150, opacity: 0, duration: 2.5, ease: "elastic.out(1, 0.4)", stagger: 0.12 })
                .from('.v4-cube', { scale: 0, rotation: 720, opacity: 0, duration: 3, ease: "back.out(1.4)" }, "-=2");

            // 2. MAGNETIC TEXT EFFECT
            const handleMouseMove = (e) => {
                if (e.target.closest('.v4-glassCard')) return;
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;
                const x = (clientX / innerWidth - 0.5) * 2;
                const y = (clientY / innerHeight - 0.5) * 2;
                gsap.to(heroTextRef.current, { x: x * 30, y: y * 30, duration: 1.2, ease: "power2.out" });
                gsap.to(artifactRef.current, { x: -x * 20, y: -y * 20, rotationY: x * 15, rotationX: -y * 15, duration: 1.8, ease: "power2.out" });
            };
            window.addEventListener('mousemove', handleMouseMove);

            // 3. BENTO REVEAL
            gsap.from('.v4-glassCard', { scrollTrigger: { trigger: '.v4-bentoSection', start: 'top 80%' }, y: 100, opacity: 0, duration: 1.2, stagger: 0.08, ease: "power3.out" });

            // 5. GLOBAL AGGRESSIVE SCROLL SKEW ( GOD MODE )
            let proxy = { skew: 0 },
                skewSetter = gsap.quickSetter(".v4-container", "skewY", "deg"),
                clamp = gsap.utils.clamp(-10, 10);

            ScrollTrigger.create({
                onUpdate: (self) => {
                    let skew = clamp(self.getVelocity() / -100);
                    if (Math.abs(skew) > 0.1) {
                        gsap.to(proxy, {
                            skew: skew,
                            duration: 1,
                            ease: "power3",
                            overwrite: true,
                            onUpdate: () => skewSetter(proxy.skew)
                        });
                    }
                }
            });

            // 6. CINEMATIC PARALLAX PROJECTS
            gsap.utils.toArray('.v4-cinematicProject').forEach(card => {
                const img = card.querySelector('.v4-cineImage');
                gsap.fromTo(img,
                    { backgroundPosition: "50% 0%" },
                    {
                        backgroundPosition: "50% 100%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1.5
                        }
                    }
                );
            });

            return () => window.removeEventListener('mousemove', handleMouseMove);
        }, mainRef);
        return () => ctx.revert();
    }, [loading]);

    const handleIntroComplete = () => {
        sessionStorage.setItem('portfolioVisited', 'true');
        setLoading(false);
    };

    const projects = [
        {
            title: "MCD HRMS",
            desc: "Enterprise HR System for Government Municipal Corporation. Payroll, Attendance, and Performance tracking for 5000+ employees.",
            tech: ["Python", "Django", "PostgreSQL"],
            img: "/dev-portfolio/images/projects/mcd-hrms.png",
            link: "https://mcd-hrms.web.app",
            stat: "5000+ Users"
        },
        {
            title: "AcadHub",
            desc: "Academic Management Dashboard. Streamlined workflows for students and faculty with real-time data sync.",
            tech: ["React", "Node.js", "Firebase"],
            img: "/dev-portfolio/images/projects/acadhub.png",
            link: "https://acadhub.kuberbassi.com",
            stat: "Real-time Sync"
        },
        {
            title: "IndiaOnRoaming",
            desc: "Travel Portal for Indian Tourism. High-performance booking engine with immersive visual storytelling.",
            tech: ["React", "Next.js", "Tailwind"],
            img: "/dev-portfolio/images/projects/indiaonroaming.png",
            link: "https://indiaonroaming.com"
        },
        {
            title: "Sugandhmaya",
            desc: "Luxury E-Commerce for Fragrances. Custom Shopify theme architecture with premium animations.",
            tech: ["Shopify", "Liquid", "JS"],
            img: "/dev-portfolio/images/projects/sugandhmaya.png",
            link: "https://sugandhmaya.com"
        }
    ];

    if (loading) return <BiosLoader onComplete={handleIntroComplete} />;

    return (
        <div className="v4-container" ref={mainRef}>
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
                    <h1 className="v4-monolithText" style={{ color: '#3b82f6' }}><HyperText text="ARCHITECT" /></h1>
                    <span className="v4-monolithSub">AI-Native // Python // System Design</span>
                </div>
                <TerminalWidget />
            </section>

            {/* BENTO LAYOUT */}
            <section id="arsenal" className="v4-bentoSection">
                <div className="v4-bentoGrid">
                    <TiltCard className="v4-span2">
                        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '10rem', opacity: 0.05, transform: 'rotate(-20deg)', pointerEvents: 'none' }}>
                            <i className="fas fa-drafting-compass"></i>
                        </div>
                        <h2 className="v4-cardTitle"><HyperText text="THE ARCHITECT" /></h2>
                        <p className="v4-cardText">
                            I don't just write code; I <strong style={{ color: '#fff' }}>engineer ecosystems</strong>.
                            Specializing in <strong>AI-Native Workflows, Encrypted DNS Security</strong>, and
                            <strong> Cloudflare Zero Trust</strong> architectures.
                        </p>
                    </TiltCard>

                    <TiltCard className="v4-spanRow2">
                        <h2 className="v4-cardTitle" style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}><HyperText text="ARSENAL" /></h2>
                        <TechMarquee />
                        <div style={{ marginTop: '2rem' }}>
                            <span className="v4-sticker accent">Node.js</span>
                            <span className="v4-sticker">Docker & K8s</span>
                            <span className="v4-sticker accent">AWS Cloud</span>
                            <span className="v4-sticker">PostgreSQL</span>
                            <span className="v4-sticker accent">AI-Native Dev</span>
                            <span className="v4-sticker">Prompt Engineering</span>
                            <span className="v4-sticker">Firebase</span>
                            <span className="v4-sticker accent">React Ecosystem</span>
                            <span className="v4-sticker">UI/UX Design</span>
                            <span className="v4-sticker">GSAP</span>
                        </div>
                    </TiltCard>

                    <TiltCard>
                        <h2 className="v4-cardTitle" style={{ color: '#3b82f6', fontSize: '2.5rem' }}><HyperText text="AI-NATIVE" /></h2>
                        <p className="v4-cardText">Prompt Eng. Expert</p>
                    </TiltCard>

                    <TiltCard>
                        <h2 className="v4-cardTitle" style={{ fontSize: '2.5rem' }}><HyperText text="CONNECT" /></h2>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                            <a href="https://github.com/kuberbassi" target="_blank" className="v4-sticker" style={{ margin: 0, padding: '0.8rem' }}><i className="fab fa-github"></i></a>
                            <a href="https://www.linkedin.com/in/kuberbassi/" target="_blank" className="v4-sticker" style={{ margin: 0, padding: '0.8rem' }}><i className="fab fa-linkedin"></i></a>
                            <a href="https://www.instagram.com/kuber.bassi/" target="_blank" className="v4-sticker" style={{ margin: 0, padding: '0.8rem' }}><i className="fab fa-instagram"></i></a>
                        </div>
                        <a href="mailto:kuberbassi2007@gmail.com" style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666', fontFamily: 'JetBrains Mono', display: 'block', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#666'}>kuberbassi2007@gmail.com</a>
                    </TiltCard>
                </div>
            </section>

            {/* --- SYSTEM CORE (PRINCIPLES) --- */}
            <section className="v4-coreSection" id="about">
                <h2 className="v4-monolithText" style={{ fontSize: '5rem', marginBottom: '4rem', textAlign: 'center' }}><HyperText text="SYSTEM CORE" /></h2>
                <div className="v4-coreGrid">
                    <div className="v4-holoCard">
                        <div className="v4-holoIcon">⚡</div>
                        <h3 style={{ fontFamily: 'Anton', fontSize: '1.8rem', color: '#fff', marginBottom: '1rem' }}>VELOCITY</h3>
                        <p style={{ color: '#aaa', lineHeight: 1.6 }}>Optimized for sub-millisecond latency. Every interaction is fluid, instant, and lighter than air.</p>
                    </div>
                    <div className="v4-holoCard">
                        <div className="v4-holoIcon">🛡️</div>
                        <h3 style={{ fontFamily: 'Anton', fontSize: '1.8rem', color: '#fff', marginBottom: '1rem' }}>SECURITY</h3>
                        <p style={{ color: '#aaa', lineHeight: 1.6 }}>Fortress-grade architecture. Data integrity and user privacy are engineered into the DNA.</p>
                    </div>
                    <div className="v4-holoCard">
                        <div className="v4-holoIcon">💎</div>
                        <h3 style={{ fontFamily: 'Anton', fontSize: '1.8rem', color: '#fff', marginBottom: '1rem' }}>AESTHETICS</h3>
                        <p style={{ color: '#aaa', lineHeight: 1.6 }}>Beauty is a function of utility. Minimalist design that serves the user's intent without distraction.</p>
                    </div>
                </div>
            </section>

            {/* --- PROJECT DECK (CINEMATIC SCROLL) --- */}
            <section className="v4-deckSection" id="projects">
                {projects.map((proj, i) => (
                    <div className="v4-cinematicProject" key={i}>
                        <div className="v4-cineImage" style={{ backgroundImage: `url(${proj.img})` }}>
                            <div className="v4-cineOverlay"></div>
                        </div>
                        <div className="v4-cineContent">
                            <div className="v4-cineHeader">
                                <span className="v4-cineIndex">0{i + 1}</span>
                                <div className="v4-cineLine"></div>
                                <span className="v4-cineStat">{proj.stat || 'SYSTEM ONLINE'}</span>
                            </div>
                            <h2 className="v4-cineTitle"><HyperText text={proj.title.toUpperCase()} /></h2>
                            <p className="v4-cineDesc">{proj.desc}</p>
                            <div className="v4-cineTech">
                                {proj.tech.map((t, j) => (
                                    <span key={j} className="v4-techTag">{t}</span>
                                ))}
                            </div>
                            <a href={proj.link} target="_blank" className="v4-sticker" style={{ marginTop: '2rem', background: '#3b82f6', color: '#fff', border: 'none' }}>
                                VIEW SYSTEM
                            </a>
                        </div>
                    </div>
                ))}
            </section>

            {/* Footer */}
            <section id="contact">
                <EnhancedFooter />
            </section>
        </div>
    );
};

export default DevPortfolio;
