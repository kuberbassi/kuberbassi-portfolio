import React, { useState, useEffect } from 'react';

export const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll > 0) {
                setProgress((window.pageYOffset / totalScroll) * 100);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 9999
        }}>
            <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(to right, #00ff88, #00e5ff)',
                boxShadow: '0 0 10px #00ff88',
                transition: 'width 0.1s ease-out'
            }} />
        </div>
    );
};

export default ScrollProgress;
