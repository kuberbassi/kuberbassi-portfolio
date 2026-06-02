import React from 'react';

export const EnhancedFooter = () => (
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
                <a href="mailto:me@kuberbassi.com" className="v4-megaLink" style={{ whiteSpace: 'nowrap' }}>
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
                        <a href="https://github.com/kuberbassi" target="_blank" rel="noopener noreferrer" className="v4-footerIcon"><i className="fab fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/kuberbassi/" target="_blank" rel="noopener noreferrer" className="v4-footerIcon"><i className="fab fa-linkedin"></i></a>
                        <a href="https://www.instagram.com/kuber.bassi/" target="_blank" rel="noopener noreferrer" className="v4-footerIcon"><i className="fab fa-instagram"></i></a>
                        <a href="mailto:me@kuberbassi.com" className="v4-footerIcon"><i className="fas fa-envelope"></i></a>
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
                bottom: 'max(3rem, env(safe-area-inset-bottom, 3rem))',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.4rem',
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

export default EnhancedFooter;
