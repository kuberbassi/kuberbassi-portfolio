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
            const particleCount = Math.floor((width * height) / 15000); // Less dense, more airy

            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    baseX: Math.random() * width, // For returning tendency
                    baseY: Math.random() * height,
                    size: Math.random() * 2 + 0.5, // Varied sizes
                    density: (Math.random() * 30) + 1,
                    vx: (Math.random() - 0.5) * 0.2, // Gentle drift
                    vy: (Math.random() - 0.5) * 0.2,
                    alpha: Math.random() * 0.5 + 0.1,
                    pulseSpeed: 0.02 + Math.random() * 0.03, // For twinkling
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
                // Organic movement
                p.x += p.vx;
                p.y += p.vy;

                // Gentle sine wave motion (floating music note feel)
                p.x += Math.sin(time + p.density) * 0.1;

                // Mouse interaction - gentle push
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < interactionRadius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (interactionRadius - distance) / interactionRadius;

                    // Push away gently
                    const directionX = forceDirectionX * force * p.density * 0.6;
                    const directionY = forceDirectionY * force * p.density * 0.6;

                    p.x -= directionX;
                    p.y -= directionY;
                }

                // Wrap around screen for continuous flow
                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;

                // Twinkle effect (breathing)
                const breathing = Math.sin(time * 2 + p.pulseOffset) * 0.1;
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
