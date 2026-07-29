import { useEffect, useRef } from 'react';

const CHAR_SET = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];

export function AsciiArtStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const cols = 52;
    const rows = 36;
    const cellW = width / cols;
    const cellH = height / rows;

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);
      ctx.font = '11px monospace';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellW + cellW / 2;
          const y = r * cellH + cellH / 2;

          // Wave function combined with mouse distance
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseEffect = Math.exp(-dist / 90) * Math.sin(dist / 14 - time * 3) * 0.8;

          const wave =
            Math.sin(c * 0.2 + time) * 0.5 +
            Math.cos(r * 0.2 + time * 0.8) * 0.5 +
            mouseEffect;

          const norm = Math.max(0, Math.min(1, (wave + 1) / 2));
          const charIndex = Math.floor(norm * (CHAR_SET.length - 1));
          const char = CHAR_SET[charIndex];

          // Gold accent glow for active/high density points
          if (norm > 0.65 || mouseEffect > 0.2) {
            ctx.fillStyle = '#d5b27e';
          } else if (norm > 0.4) {
            ctx.fillStyle = '#7a766f';
          } else {
            ctx.fillStyle = '#3a3834';
          }

          ctx.fillText(char, c * cellW, r * cellH);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block opacity-85 transition-opacity duration-500 hover:opacity-100"
    />
  );
}
