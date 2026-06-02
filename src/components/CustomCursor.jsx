import React, { useEffect, useState, useRef } from 'react';

function CustomCursor() {
  const [canHover, setCanHover] = useState(() => {
    return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });
  const [position, setPosition] = useState({ x: -80, y: -80 });
  const [active, setActive] = useState(false);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -80, y: -80 });
  const lastSpawnRef = useRef(0);
  
  const runes = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛋᛏᛒᛖᛗᛚᛜᛞᛟ✦✧◆◇✶";
  const colors = ["#e8bd72", "#9a84ff", "#f7ead6", "#d66a52", "#7ce0a5"];

  useEffect(() => {
    if (!canHover) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const onMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      setPosition({ x, y });
      mouseRef.current = { x, y };

      // Spawn trail runes
      const now = Date.now();
      if (now - lastSpawnRef.current > 45) { // Spawn particle every 45ms during movement
        spawnParticle(x, y, false);
        lastSpawnRef.current = now;
      }
    };

    const spawnParticle = (x, y, isKeypress = false) => {
      const char = runes[Math.floor(Math.random() * runes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const newParticle = {
        x,
        y,
        // Keyboard particles shoot out and float faster
        vx: isKeypress ? (Math.random() - 0.5) * 4.5 : (Math.random() - 0.5) * 0.8,
        vy: isKeypress ? -Math.random() * 2.5 - 2.5 : -Math.random() * 0.6 - 0.3,
        life: isKeypress ? 85 : 45,
        maxLife: isKeypress ? 85 : 45,
        size: isKeypress ? Math.random() * 12 + 16 : Math.random() * 7 + 10,
        character: char,
        color: color
      };
      particlesRef.current.push(newParticle);
    };

    const onOver = (event) => {
      // Toggle cursor expansion on hover of interactive portals, cards, triggers
      setActive(Boolean(event.target.closest('a, button, .mp-portalCard, .mp-archiveRow, .v4-holoCard, .v4-projectCardNew, .logo, .mp-mark, .mp-chronicleMarks a')));
    };

    const onKeyDown = (event) => {
      // Don't spawn for system keys like shift, ctrl, command, alt
      if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Enter') {
        spawnParticle(mouseRef.current.x, mouseRef.current.y, true);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    window.addEventListener('keydown', onKeyDown);

    let animId;
    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.016; // float acceleration (upward)
        p.life -= 1;

        const progress = p.life / p.maxLife;
        const alpha = Math.max(0, progress);

        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Add subtle chromatic shadow/glow
        ctx.shadowBlur = progress * 8;
        ctx.shadowColor = p.color;
        
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = p.color;
        ctx.fillText(p.character, p.x, p.y);
        ctx.restore();
      });

      // Remove dead particles
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      animId = requestAnimationFrame(updateParticles);
    };
    
    updateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      window.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!canHover) return null;

  return (
    <>
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          pointerEvents: 'none', 
          zIndex: 9998 
        }} 
      />
      <div
        className={`mp-cursor ${active ? 'is-active' : ''}`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
        aria-hidden="true"
      />
    </>
  );
}

export default CustomCursor;
