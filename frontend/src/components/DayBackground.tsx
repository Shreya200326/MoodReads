import { useEffect, useRef } from "react";

export default function DayBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Clouds
    const clouds = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: 40 + Math.random() * canvas.height * 0.45,
      w: 120 + Math.random() * 200,
      h: 40 + Math.random() * 50,
      speed: 0.15 + Math.random() * 0.25,
      opacity: 0.75 + Math.random() * 0.25,
    }));

    // Birds (tiny V shapes)
    const birds = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: 30 + Math.random() * canvas.height * 0.35,
      speed: 0.4 + Math.random() * 0.5,
      size: 3 + Math.random() * 4,
      flap: Math.random() * Math.PI * 2,
      flapSpeed: 0.05 + Math.random() * 0.04,
    }));

    function drawCloud(
      cx: number,
      cy: number,
      w: number,
      h: number,
      opacity: number
    ) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(180,220,255,0.4)";
      ctx.shadowBlur = 18;

      const rx = w / 2;
      const ry = h / 2;
      // Main body
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      // Puffs
      ctx.beginPath();
      ctx.ellipse(cx - rx * 0.4, cy + ry * 0.15, rx * 0.55, ry * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + rx * 0.4, cy + ry * 0.15, rx * 0.5, ry * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx, cy - ry * 0.3, rx * 0.6, ry * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawBird(b: (typeof birds)[0]) {
      const flapY = Math.sin(b.flap) * b.size * 0.5;
      ctx.save();
      ctx.strokeStyle = "rgba(60,100,160,0.5)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(b.x - b.size, b.y - flapY);
      ctx.quadraticCurveTo(b.x, b.y, b.x + b.size, b.y - flapY);
      ctx.stroke();
      ctx.restore();
    }

    let t = 0;
    function draw() {
      t++;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, "#87CEEB");
      sky.addColorStop(0.5, "#B0E0FF");
      sky.addColorStop(1, "#E8F4FF");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun glow
      const sunX = canvas.width * 0.82;
      const sunY = canvas.height * 0.12;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 160);
      sunGlow.addColorStop(0, "rgba(255,240,160,0.9)");
      sunGlow.addColorStop(0.3, "rgba(255,220,80,0.4)");
      sunGlow.addColorStop(1, "rgba(255,200,50,0)");
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun disc
      ctx.beginPath();
      ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFACD";
      ctx.shadowColor = "rgba(255,200,50,0.8)";
      ctx.shadowBlur = 40;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ground haze
      const haze = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
      haze.addColorStop(0, "rgba(200,235,255,0)");
      haze.addColorStop(1, "rgba(220,240,255,0.5)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move and draw clouds
      clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x - c.w > canvas.width) c.x = -c.w;
        drawCloud(c.x, c.y, c.w, c.h, c.opacity);
      });

      // Move and draw birds
      birds.forEach((b) => {
        b.x += b.speed;
        b.flap += b.flapSpeed;
        if (b.x > canvas.width + 20) b.x = -20;
        drawBird(b);
      });

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}