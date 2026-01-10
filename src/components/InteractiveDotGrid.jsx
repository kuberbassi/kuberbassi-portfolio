import React, { useEffect, useRef } from 'react';
import styles from './styles/InteractiveDotGrid.module.css';

const InteractiveDotGrid = () => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Initialize particles with organic random positions
        const initParticles = () => {
            particlesRef.current = [];
            const particleCount = Math.floor((width * height) / 8000); // More particles for better texture
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5, // Faster, smoother drift
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 1.5 + 0.2, // Smaller, finer dust
                    alpha: Math.random() * 0.4 + 0.1, // Subtler
                    pulseSpeed: 0.01 + Math.random() * 0.02,
                    pulseOffset: Math.random() * Math.PI * 2
                });
            }
        };

        const setCanvasSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };
        window.addEventListener('mouseleave', handleMouseLeave);

        let time = 0;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.01;

            const mouse = mouseRef.current;
            const interactionRadius = 200;

            particlesRef.current.forEach((p) => {
                // Smooth Drift
                p.x += p.vx;
                p.y += p.vy;

                // Mouse interaction - simple fluid repulsion
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const angle = Math.atan2(dy, dx);
                    const force = (150 - distance) / 150;
                    const pushX = Math.cos(angle) * force * 1;
                    const pushY = Math.sin(angle) * force * 1;

                    p.x -= pushX;
                    p.y -= pushY;
                }

                // Wrap around edges nicely
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                if (p.y > height + 10) p.y = -10;

                // Breathing Alpha
                const breathing = Math.sin(time + p.pulseOffset) * 0.1;
                const currentAlpha = p.alpha + breathing;

                // Draw
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, currentAlpha))})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default InteractiveDotGrid;
