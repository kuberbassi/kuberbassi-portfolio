import { useEffect, useRef } from 'react';

export function AsciiTerrain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0, raf = 0;
    const pointer = { x: -9999, y: -9999 };
    const resize = () => { const r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio, 2); canvas.width = r.width * d; canvas.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; };
    const draw = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight, t = frame++ * .008;
      ctx.clearRect(0, 0, w, h); ctx.lineWidth = .7;
      for (let level = -3; level < 3; level += .48) { ctx.beginPath(); for (let x = 0; x <= w; x += 8) { const y = h * .58 + Math.sin(x * .018 + level * 1.9 + t) * (38 + level * 8) + Math.sin(x * .042 - t * .8) * 18 + level * 43; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = `rgba(213,178,126,${.05 + (level + 3) * .015})`; ctx.stroke(); }
      const gap = w < 700 ? 12 : 15, glyphs = ' .:-=+*#%@'; ctx.font = `${w < 700 ? 9 : 11}px ui-monospace, monospace`; ctx.textAlign = 'center';
      const cx = w * .56, cy = h * .48;
      for (let y = 50; y < h - 26; y += gap) for (let x = 22; x < w - 22; x += gap) { const distance = Math.hypot(x - pointer.x, y - pointer.y), energy = Math.max(0, 1 - distance / 145), radius = Math.hypot((x - cx) / .9, y - cy), body = Math.max(0, 1 - radius / (Math.min(w, h) * .48)), wave = Math.sin(x * .022 + t) + Math.cos(y * .026 - t * .7), density = Math.max(0, Math.min(1, body * .76 + wave * .12 + energy * .85)); if (density < .17) continue; ctx.fillStyle = `rgba(213,178,126,${.05 + density * (.22 + energy * .55)})`; ctx.fillText(glyphs[Math.floor(density * 9)], x + Math.sin(t + y) * energy * 4, y); }
      raf = requestAnimationFrame(draw);
    };
    resize(); draw(); window.addEventListener('resize', resize); window.addEventListener('pointermove', move);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); };
  }, []);
  return <canvas ref={ref} className="ascii-terrain" aria-hidden="true" />;
}
