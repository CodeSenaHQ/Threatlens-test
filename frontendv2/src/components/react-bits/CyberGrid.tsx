import React, { useEffect, useRef } from 'react';

interface CyberGridProps {
  className?: string;
  gridColor?: string;
  dotColor?: string;
}

export const CyberGrid: React.FC<CyberGridProps> = ({
  className = '',
  gridColor = 'rgba(59, 130, 246, 0.07)',
  dotColor = 'rgba(59, 130, 246, 0.25)',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const draw = () => {
      offset = (offset + 0.2) % 40;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacing = 40;
      const width = canvas.width;
      const height = canvas.height;

      // Draw subtle grid lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      for (let x = (offset % spacing); x < width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = (offset % spacing); y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw subtle dots at intersections with a fade mask
      ctx.fillStyle = dotColor;
      for (let x = (offset % spacing); x < width; x += spacing) {
        for (let y = (offset % spacing); y < height; y += spacing) {
          // Add subtle pulse on random nodes
          const distFromCenter = Math.hypot(x - width / 2, y - height / 2);
          const maxDist = Math.hypot(width / 2, height / 2);
          const alpha = 1 - distFromCenter / maxDist;

          if (alpha > 0.1) {
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [gridColor, dotColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 opacity-60 ${className}`}
    />
  );
};
