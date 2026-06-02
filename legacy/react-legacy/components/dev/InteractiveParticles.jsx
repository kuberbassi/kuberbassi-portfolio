import React, { useEffect, useRef } from 'react';

export const InteractiveParticles = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]); // Use ref for particles
    const mouseRef = useRef({ x: 0, y: 0, radius: 100 }); // Mouse interaction

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let animationFrameId; // Track animation frame for cleanup

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particlesRef.current = [];
            const count = Math.min(Math.floor(width * height / 35000), 60); // Optimized Density & Hard Cap
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 2
                });
            }
        };

        const onMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const updatePhysics = () => {
            const mouse = mouseRef.current;

            particlesRef.current.forEach((p) => {
                // Move particles
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off walls
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Mouse repulsion
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < mouse.radius * mouse.radius) {
                    const dist = Math.sqrt(distSq);
                    if (dist > 0) {
                        const angle = Math.atan2(dy, dx);
                        const force = (mouse.radius - dist) / mouse.radius;
                        p.vx += Math.cos(angle) * force * 0.5;
                        p.vy += Math.sin(angle) * force * 0.5;
                    }
                }

                // Dampen velocity
                p.vx *= 0.99;
                p.vy *= 0.99;
            });
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0, 255, 136, 0.4)';
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.05)';

            updatePhysics(); // Update physics before drawing

            particlesRef.current.forEach((p, i) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Connections (Optimized: Avoid Math.sqrt check by comparing squared distance first)
                particlesRef.current.forEach((p2, j) => {
                    if (j > i) {
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const distSq = dx * dx + dy * dy;
                        if (distSq < 14400) { // 120px squared
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
        window.addEventListener('mousemove', onMouseMove);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="v4-particleCanvas" />;
};

export default InteractiveParticles;
