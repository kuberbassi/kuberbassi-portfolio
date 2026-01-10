import React, { useEffect, useRef } from 'react';

const GlitchCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let points = [];
        let mouse = { x: width / 2, y: height / 2, radius: 100 };
        let animationFrameId;

        class Point {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.originalX = x;
                this.originalY = y;
            }
            update() {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 2;
                    this.y += (dy / dist) * force * 2;
                }
                this.x += (this.originalX - this.x) * 0.1;
                this.y += (this.originalY - this.y) * 0.1;

                // Random glitch jitter
                if (Math.random() < 0.005) {
                    this.x += (Math.random() - 0.5) * 10;
                    this.y += (Math.random() - 0.5) * 10;
                }
            }
        }

        const initGrid = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            points = [];
            const gridSize = 30; // Configurable grid size
            for (let x = 0; x < width + gridSize; x += gridSize) {
                for (let y = 0; y < height + gridSize; y += gridSize) {
                    points.push(new Point(x, y));
                }
            }
        };

        const animateGrid = () => {
            ctx.clearRect(0, 0, width, height);
            points.forEach(p => {
                p.update();
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);

                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const intensity = Math.max(0, 1 - dist / 200);

                if (intensity > 0.5 && Math.random() < 0.1) {
                    ctx.fillStyle = `rgba(255, 0, 51, ${intensity})`; // Red glitch accent
                } else {
                    ctx.fillStyle = `rgba(163, 163, 163, ${0.2 + intensity * 0.5})`; // Base grey
                }
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animateGrid);
        };

        const handleResize = () => initGrid();
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        initGrid();
        animateGrid();

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none'
            }}
        />
    );
};

export default GlitchCanvas;
