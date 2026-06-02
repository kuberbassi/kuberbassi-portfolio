import React, { useRef } from 'react';
import gsap from 'gsap';

export const TiltCard = ({ children, className }) => {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Tilt Math
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        // Mouse-light for glass card
        const pctX = (x / rect.width)  * 100;
        const pctY = (y / rect.height) * 100;
        cardRef.current.style.setProperty('--mouse-x', `${pctX}%`);
        cardRef.current.style.setProperty('--mouse-y', `${pctY}%`);

        gsap.to(cardRef.current, {
            rotateX,
            rotateY,
            scale: 1.01,
            duration: 0.4,
            ease: 'power2.out'
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)'
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

export default TiltCard;
