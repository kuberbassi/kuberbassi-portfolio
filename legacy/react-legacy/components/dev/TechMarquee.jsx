import React from 'react';

export const TechMarquee = () => {
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

export default TechMarquee;
