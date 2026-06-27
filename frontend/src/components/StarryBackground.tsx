import { useEffect, useRef } from 'react';

interface Star { x: number; y: number; r: number; phase: number; speed: number }
interface Comet { x: number; y: number; len: number; vx: number; vy: number; opacity: number; active: boolean }

export default function StarryBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars
    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.015,
    }));

    // Comets
    const comets: Comet[] = Array.from({ length: 3 }, () => ({ x: 0, y: 0, len: 0, vx: 0, vy: 0, opacity: 0, active: false }));
    let lastComet = 0;

    const launchComet = (c: Comet) => {
      c.x = Math.random() * canvas.width * 0.6;
      c.y = Math.random() * canvas.height * 0.3;
      c.len = 60 + Math.random() * 80;
      const angle = 0.7 + (Math.random() - 0.5) * 0.4;
      const speed = 7 + Math.random() * 6;
      c.vx = Math.cos(angle) * speed;
      c.vy = Math.sin(angle) * speed;
      c.opacity = 1;
      c.active = true;
    };

    let t = 0;

    const draw = () => {
      t += 0.016;

      // Night sky gradient
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, '#05051A');
      bg.addColorStop(0.6, '#0C0F2A');
      bg.addColorStop(1, '#11153E');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula blobs
      const n1 = ctx.createRadialGradient(canvas.width * 0.75, canvas.height * 0.2, 0, canvas.width * 0.75, canvas.height * 0.2, 280);
      n1.addColorStop(0, 'rgba(124,92,255,0.06)');
      n1.addColorStop(1, 'rgba(124,92,255,0)');
      ctx.fillStyle = n1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const n2 = ctx.createRadialGradient(canvas.width * 0.2, canvas.height * 0.7, 0, canvas.width * 0.2, canvas.height * 0.7, 220);
      n2.addColorStop(0, 'rgba(236,72,153,0.05)');
      n2.addColorStop(1, 'rgba(236,72,153,0)');
      ctx.fillStyle = n2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach(s => {
        s.phase += s.speed;
        const a = (Math.sin(s.phase) + 1) / 2 * 0.75 + 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216,217,242,${a})`;
        ctx.fill();
      });

      // Comets
      if (t - lastComet > 9 + Math.random() * 6) {
        const idle = comets.find(c => !c.active);
        if (idle) { launchComet(idle); lastComet = t; }
      }
      comets.forEach(c => {
        if (!c.active) return;
        c.x += c.vx; c.y += c.vy; c.opacity -= 0.018;
        if (c.opacity <= 0 || c.x > canvas.width || c.y > canvas.height) { c.active = false; return; }
        const tx = c.x - (c.vx / Math.hypot(c.vx, c.vy)) * c.len;
        const ty = c.y - (c.vy / Math.hypot(c.vx, c.vy)) * c.len;
        const g = ctx.createLinearGradient(tx, ty, c.x, c.y);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(1, `rgba(255,255,255,${c.opacity})`);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(c.x, c.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 w-full h-full -z-10 pointer-events-none" />;
}
