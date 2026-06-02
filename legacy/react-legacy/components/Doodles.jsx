import React, { useEffect, useRef } from 'react';
import styles from './styles/Doodles.module.css';

const Doodles = () => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create particles
        const createParticles = () => {
            const particleCount = 50;
            particles.current = [];

            for (let i = 0; i < particleCount; i++) {
                particles.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 3 + 1,
                    shape: Math.floor(Math.random() * 5), // 0: circle, 1: triangle, 2: square, 3: line, 4: arc
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.02
                });
            }
        };
        createParticles();

        // Mouse move handler
        const handleMouseMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Draw shapes
        const drawShape = (particle) => {
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.strokeStyle = `rgba(255, 51, 51, ${0.3})`;
            ctx.fillStyle = `rgba(255, 51, 51, ${0.1})`;
            ctx.lineWidth = 1;

            switch (particle.shape) {
                case 0: // Circle
                    ctx.beginPath();
                    ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 1: // Triangle
                    ctx.beginPath();
                    ctx.moveTo(0, -particle.size);
                    ctx.lineTo(particle.size, particle.size);
                    ctx.lineTo(-particle.size, particle.size);
                    ctx.closePath();
                    ctx.stroke();
                    break;
                case 2: // Square
                    ctx.strokeRect(-particle.size, -particle.size, particle.size * 2, particle.size * 2);
                    break;
                case 3: // Line
                    ctx.beginPath();
                    ctx.moveTo(-particle.size * 2, 0);
                    ctx.lineTo(particle.size * 2, 0);
                    ctx.stroke();
                    break;
                case 4: // Arc
                    ctx.beginPath();
                    ctx.arc(0, 0, particle.size, 0, Math.PI);
                    ctx.stroke();
                    break;
            }
            ctx.restore();
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.current.forEach((particle) => {
                // Mouse interaction
                const dx = mouse.current.x - particle.x;
                const dy = mouse.current.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.vx -= (dx / distance) * force * 0.2;
                    particle.vy -= (dy / distance) * force * 0.2;
                }

                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.rotation += particle.rotationSpeed;

                // Damping
                particle.vx *= 0.98;
                particle.vy *= 0.98;

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.vx *= -1;
                    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.vy *= -1;
                    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
                }

                drawShape(particle);
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.doodleCanvas} />;
};

export default Doodles;
