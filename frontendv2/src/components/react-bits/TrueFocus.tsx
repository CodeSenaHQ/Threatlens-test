import React, { useEffect, useRef, useState } from 'react';

interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = 'Next-Gen Threat Intelligence',
  manualMode = false,
  blurAmount = 4,
  borderColor = '#3b82f6',
  glowColor = 'rgba(59, 130, 246, 0.5)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = '',
}) => {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (manualMode) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left - 4,
      y: activeRect.top - parentRect.top - 2,
      width: activeRect.width + 8,
      height: activeRect.height + 4,
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(currentIndex);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode && lastActiveIndex !== null) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-wrap items-center gap-2 ${className}`}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className="relative cursor-pointer select-none text-white font-semibold transition-all duration-300"
            style={{
              filter: isActive ? 'none' : `blur(${blurAmount}px)`,
              opacity: isActive ? 1 : 0.45,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      {/* Focus Box */}
      <div
        className="pointer-events-none absolute rounded-md border border-blue-500 transition-all duration-300 ease-out"
        style={{
          transform: `translate(${focusRect.x}px, ${focusRect.y}px)`,
          width: `${focusRect.width}px`,
          height: `${focusRect.height}px`,
          borderColor: borderColor,
          boxShadow: `0 0 16px ${glowColor}, inset 0 0 8px ${glowColor}`,
        }}
      >
        <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-blue-400" />
        <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-blue-400" />
        <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-blue-400" />
        <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-blue-400" />
      </div>
    </div>
  );
};
