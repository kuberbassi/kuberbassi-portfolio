import React, { useState, useEffect, useMemo } from 'react';

export const TerminalNavigator = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [hoveredSection, setHoveredSection] = useState(null);

    const sections = useMemo(() => [
        { id: 'hero', label: 'INIT', icon: '>', color: '#00ff88' },
        { id: 'arsenal', label: 'STACK', icon: '$', color: '#8b5cf6' },
        { id: 'about', label: 'CORE', icon: '#', color: '#06b6d4' },
        { id: 'projects', label: 'DEPLOY', icon: '*', color: '#f59e0b' },
        { id: 'contact', label: 'LINK', icon: '@', color: '#22c55e' }
    ], []);

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
    }, [sections]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

export default TerminalNavigator;
