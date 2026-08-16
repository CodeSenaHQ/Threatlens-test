import React, { useEffect, useRef } from 'react';

interface GlowingOrbProps {
  size?: number;
  hue?: number; // 220 for electric blue, 270 for purple
  speed?: number;
  interactive?: boolean;
  className?: string;
}

export const GlowingOrb: React.FC<GlowingOrbProps> = ({
  size = 140,
  hue = 225,
  interactive = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Set high-DPI resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const baseRadius = size * 0.32;

    const particles: { angle: number; distance: number; speed: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 36; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: baseRadius * (0.8 + Math.random() * 0.6),
        speed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, size, size);

      // 1. Outer Glow Aura
      const outerGlow = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.2, centerX, centerY, size * 0.48);
      outerGlow.addColorStop(0, `hsla(${hue}, 90%, 65%, 0.35)`);
      outerGlow.addColorStop(0.5, `hsla(${hue + 35}, 85%, 55%, 0.18)`);
      outerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.48, 0, Math.PI * 2);
      ctx.fill();

      // 2. Multi-layered Core Sphere with plasma waves
      const coreGrad = ctx.createRadialGradient(
        centerX - baseRadius * 0.3 * Math.cos(time * 0.7),
        centerY - baseRadius * 0.3 * Math.sin(time * 0.7),
        baseRadius * 0.1,
        centerX,
        centerY,
        baseRadius
      );
      coreGrad.addColorStop(0, `hsl(${hue - 20}, 100%, 90%)`);
      coreGrad.addColorStop(0.3, `hsl(${hue}, 95%, 68%)`);
      coreGrad.addColorStop(0.7, `hsl(${hue + 45}, 85%, 45%)`);
      coreGrad.addColorStop(1, `hsl(${hue + 70}, 90%, 20%)`);

      ctx.save();
      ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
      ctx.shadowBlur = 24;
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + Math.sin(time * 2) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Orbiting Energy Rings
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.5);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.35, baseRadius * 0.45, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue + 20}, 90%, 75%, 0.45)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.25, baseRadius * 0.55, -Math.PI / 3, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue - 30}, 95%, 70%, 0.35)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // 4. Orbiting Star/Energy Particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = centerX + Math.cos(p.angle) * p.distance;
        const py = centerY + Math.sin(p.angle) * p.distance;

        ctx.fillStyle = `hsla(${hue + Math.sin(time) * 30}, 100%, 85%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, hue]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="pointer-events-none drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
      />
    </div>
  );
};
