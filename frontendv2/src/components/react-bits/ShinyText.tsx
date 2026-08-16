import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-slate-200 via-white to-slate-400 font-semibold ${
        !disabled ? 'animate-shiny-badge' : ''
      } ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animation: !disabled ? `shinySweep ${animationDuration} linear infinite` : 'none',
      }}
    >
      {text}
    </span>
  );
};
