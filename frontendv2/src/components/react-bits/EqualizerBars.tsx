import React from 'react';

interface EqualizerBarsProps {
  barCount?: number;
  height?: number;
  color?: string;
  active?: boolean;
  className?: string;
}

export const EqualizerBars: React.FC<EqualizerBarsProps> = ({
  barCount = 24,
  height = 40,
  color = '#3b82f6',
  active = true,
  className = '',
}) => {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div
      className={`flex items-end gap-[3px] h-[${height}px] ${className}`}
      style={{ height: `${height}px` }}
    >
      {bars.map((bar) => {
        // Vary animation duration and delay for realistic audio/signal wave effect
        const duration = 0.6 + ((bar * 13) % 9) * 0.12;
        const delay = ((bar * 7) % 11) * 0.08;

        return (
          <div
            key={bar}
            className="w-[3px] rounded-full transition-all duration-300"
            style={{
              height: active ? '100%' : '15%',
              background: `linear-gradient(to top, ${color}33, ${color}, #93c5fd)`,
              boxShadow: active ? `0 0 8px ${color}88` : 'none',
              animation: active
                ? `eqBounce ${duration}s ease-in-out ${delay}s infinite alternate`
                : 'none',
            }}
          />
        );
      })}
    </div>
  );
};
