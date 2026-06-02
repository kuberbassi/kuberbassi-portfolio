import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger, Observer } from 'gsap/all';
import '../styles/DevPortfolioV4.css'; // Global CSS (No Modules)
import KineticCursor from '../components/KineticCursor';
import SEO from '../components/SEO';
import SpellText from '../components/SpellText';
import { projects, enrichProjects, getInitialProjects } from '../data/projects';
import audioSynth from '../utils/audioSynth';

gsap.registerPlugin(ScrollTrigger, Observer);

import TiltCard from '../components/dev/TiltCard';
import TechMarquee from '../components/dev/TechMarquee';
import HyperText from '../components/dev/HyperText';
import CyberOverlay from '../components/dev/CyberOverlay';
import InteractiveParticles from '../components/dev/InteractiveParticles';
import TerminalWidget from '../components/dev/TerminalWidget';
import TerminalNavigator from '../components/dev/TerminalNavigator';
import ScrollProgress from '../components/dev/ScrollProgress';
import BiosLoader from '../components/dev/BiosLoader';
import CursorContextLabel from '../components/dev/CursorContextLabel';
import EnhancedFooter from '../components/dev/EnhancedFooter';
import StageLightHaze from '../components/dev/StageLightHaze';
import AudioVizBars from '../components/dev/AudioVizBars';




const DevPortfolio = () => {
    const [loading, setLoading] = useState(() => {
        // Show intro only if this is a new session (new tab or browser refresh)
        return !sessionStorage.getItem('portfolioVisited');
    });
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [projectData, setProjectData] = useState(() => {
        try {
            const cached = localStorage.getItem('v5_github_cache');
            if (cached) {
                const { data } = JSON.parse(cached);
                if (Array.isArray(data) && data.length > 0) return data;
            }
        } catch (e) {}
        return getInitialProjects();
    });
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const mainRef = useRef(null);
    const heroTextRef = useRef(null);
    const artifactRef = useRef(null);
    const carouselRef = useRef(null);
    const wrapperRef = useRef(null);

    // --- GitHub Metadata Automation ---
    useEffect(() => {
        const fetchGitHubData = async () => {
            const cacheKey = 'v5_github_cache';
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
                const enriched = await enrichProjects();
                setProjectData(enriched);
                localStorage.setItem(cacheKey, JSON.stringify({ data: enriched, timestamp: now }));
            } catch (err) { console.error("GitHub fetch failed:", err); }
        };

        if (!loading) fetchGitHubData();

        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [loading]);

    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            gsap.config({ force3D: true });

            const tl = gsap.timeline({
                onComplete: () => ScrollTrigger.refresh()
            });

            // 1. FLUID PAGE ENTRANCE (Music Site Style)
            gsap.set('.v4-container', { opacity: 0, scale: 1.05, filter: 'blur(10px)', willChange: 'transform, opacity, filter' });
            
            tl.to('.v4-container', { 
                opacity: 1, 
                scale: 1, 
                filter: 'blur(0px)', 
                duration: 1.2, 
                ease: "power2.out",
                onComplete: () => gsap.set('.v4-container', { clearProps: 'willChange' })
            })
            // 2. HERO ENTRANCE
            .from('.v4-monolithText', { y: 150, opacity: 0, duration: 2.0, ease: "elastic.out(1, 0.4)", stagger: 0.12 }, "-=0.8")
            .from('.v4-cube', { scale: 0, rotation: 720, opacity: 0, duration: 2.5, ease: "back.out(1.4)" }, "-=1.5");

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
    useLayoutEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

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
                {!isMobile && <TerminalNavigator />}

                <KineticCursor />
                {!isMobile && <CursorContextLabel />}
                <InteractiveParticles />
                <CyberOverlay />
                <div className="v4-noise"></div>
                <div className="v4-bgGrid"></div>

                {/* HERO */}
                <section id="hero" className="v4-heroSection">
                    {/* Stage light depth haze — desktop only */}
                    {!isMobile && <StageLightHaze />}

                    {!isMobile && (
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
                    )}
                    <div className="v4-heroContent" ref={heroTextRef}>
                        <h1 className="v4-monolithText"><SpellText text="SYSTEM" /></h1>
                        <h1 className="v4-monolithText" style={{ color: '#00ff88' }}><SpellText text="ARCHITECT" /></h1>
                        <span className="v4-monolithSub">AI-Native // Python // System Design</span>
                    </div>
                    {!isMobile && <TerminalWidget />}
                </section>

                {/* ARSENAL (STACK) SECTION */}
                <section id="arsenal" className="v4-stackSection">
                    <div className="v4-stackInner">
                        <h2 className="v4-sectionHeading reveal-fade-up" style={{ textAlign: 'left', margin: '0 0 1rem 0' }}><SpellText text="THE ARSENAL" /></h2>
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
                    <h2 className="v4-sectionHeading reveal-fade-up"><SpellText text="SYSTEM CORE" /></h2>
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
                        <SpellText text="DEPLOYMENTS" />
                    </h2>

                    <div className="v4-carouselContainer" ref={carouselRef}>
                        <div className="v4-carouselTrack" ref={wrapperRef}>
                            {projectData.map((proj, i) => (
                                <div
                                    className={`v4-projectCardNew ${flippedIndex === i ? 'is-flipped' : ''} ${activeIndex === i ? 'is-active' : ''}`}
                                    key={`${proj.projectId}-${i}`}
                                    onClick={() => {
                                        if (activeIndex !== i) { 
                                            goToCard(i);
                                            audioSynth.triggerChime(329.63); // E4 chime on card navigate
                                        } else { 
                                            setFlippedIndex(flippedIndex === i ? null : i);
                                            audioSynth.triggerChime(493.88); // B4 chime on card flip
                                        }
                                    }}

                                    onMouseMove={(e) => {
                                        // Holographic shimmer angle tracker
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const cx   = rect.left + rect.width  / 2;
                                        const cy   = rect.top  + rect.height / 2;
                                        const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
                                        const pctX  = ((e.clientX - rect.left) / rect.width)  * 100;
                                        const pctY  = ((e.clientY - rect.top)  / rect.height) * 100;
                                        e.currentTarget.style.setProperty('--card-angle', `${angle}deg`);
                                        e.currentTarget.style.setProperty('--card-mx', `${pctX}%`);
                                        e.currentTarget.style.setProperty('--card-my', `${pctY}%`);
                                    }}
                                >
                                    <div className="v4-cardInner">
                                        {/* FRONT SIDE - Premium Credit Card */}
                                        <div className={`v4-cardFront ${proj.cardClass}`}>
                                            {/* Holographic foil sheen layer */}
                                            <div className="v4-holo-sheen" />

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
                                                        onClick={(e) => { e.stopPropagation(); window.open(proj.link, '_blank', 'noopener,noreferrer'); }}
                                                    >
                                                        LIVE DEMO →
                                                    </button>
                                                    <button
                                                        className="v4-cardBtn v4-cardBtn--ghost"
                                                        onClick={(e) => { e.stopPropagation(); window.open(proj.github, '_blank', 'noopener,noreferrer'); }}
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
