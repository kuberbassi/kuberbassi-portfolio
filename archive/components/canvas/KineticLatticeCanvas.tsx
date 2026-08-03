import React, { useEffect, useRef } from 'react';

export const KineticLatticeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Dynamic Nodes / Constellation Mesh
    const COUNT = Math.min(Math.floor((width * height) / 18000), 75);
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      glowColor: string;
    }

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.3,
      glowColor: Math.random() > 0.6 ? '#f43f5e' : '#ffffff',
    }));

    // Floating Kinetic Rings / Concentric Geometry (Wallpaper inspired)
    const RINGS_COUNT = 3;
    interface KineticRing {
      x: number;
      y: number;
      r: number;
      maxR: number;
      alpha: number;
      speed: number;
    }

    const rings: KineticRing[] = Array.from({ length: RINGS_COUNT }, (_, i) => ({
      x: width * (0.3 + i * 0.25),
      y: height * (0.3 + i * 0.2),
      r: 40 + i * 80,
      maxR: 300 + i * 100,
      alpha: 0.15,
      speed: 0.2 + i * 0.1,
    }));

    const render = () => {
      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Ambient Radial Spotlight at Mouse Location
      const radialGlow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        500
      );
      radialGlow.addColorStop(0, 'rgba(225, 29, 72, 0.09)');
      radialGlow.addColorStop(0.5, 'rgba(159, 18, 57, 0.03)');
      radialGlow.addColorStop(1, 'rgba(5, 5, 8, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Geometric Expanding Rings (Artistic Halo Effect)
      rings.forEach((ring) => {
        ring.r += ring.speed;
        if (ring.r > ring.maxR) {
          ring.r = 40;
        }

        const fadeAlpha = (1 - ring.r / ring.maxR) * 0.12;
        ctx.strokeStyle = `rgba(244, 63, 94, ${fadeAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs / Barb marks on ring
        const barbAngle = (Date.now() * 0.0005) % (Math.PI * 2);
        const bx = ring.x + Math.cos(barbAngle) * ring.r;
        const by = ring.y + Math.sin(barbAngle) * ring.r;
        ctx.fillStyle = `rgba(255, 255, 255, ${fadeAlpha * 2})`;
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Connect Constellation Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * 0.15;
            ctx.strokeStyle = `rgba(244, 63, 94, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 4. Update & Render Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Subtle attraction to mouse
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
          p.x += (mdx / mdist) * 0.3;
          p.y += (mdy / mdist) * 0.3;
        }

        ctx.fillStyle = p.glowColor === '#ffffff' ? `rgba(255, 255, 255, ${p.alpha})` : `rgba(244, 63, 94, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
};
