import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Simple lightweight cursor
const KineticCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        const onMouseMove = (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'expo.out' });
        };

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <>
            {/* The Dot */}
            <div
                ref={cursorRef}
                className="kinetic-cursor-dot"
                style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '10px', height: '10px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                    mixBlendMode: 'difference'
                }}
            />
            {/* The Ring */}
            <div
                ref={followerRef}
                className="kinetic-cursor-ring"
                style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '40px', height: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9998,
                    mixBlendMode: 'difference'
                }}
            />
        </>
    );
};

export default KineticCursor;
