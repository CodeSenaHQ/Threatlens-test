import React, { useEffect, useState, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover';
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 12,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+~|}{[]:;?><',
  className = '',
  parentClassName = '',
  encryptedClassName = 'text-blue-400 opacity-75 font-mono',
  animateOn = 'view',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let iteration = 0;

    const startScramble = () => {
      setIsScrambling(true);
      iteration = 0;
      setRevealedIndices(new Set());

      interval = setInterval(() => {
        setDisplayText(() => {
          return text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (iteration >= maxIterations || (iteration / maxIterations) * text.length > index) {
                setRevealedIndices((prev) => new Set(prev).add(index));
                return char;
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join('');
        });

        iteration += 1;
        if (iteration > maxIterations + 4) {
          clearInterval(interval);
          setDisplayText(text);
          setIsScrambling(false);
        }
      }, speed);
    };

    if (animateOn === 'view') {
      startScramble();
    } else if (animateOn === 'hover' && isHovering) {
      startScramble();
    }

    return () => clearInterval(interval);
  }, [text, speed, maxIterations, characters, animateOn, isHovering]);

  return (
    <span
      ref={containerRef}
      className={`inline-block ${parentClassName}`}
      onMouseEnter={() => animateOn === 'hover' && setIsHovering(true)}
      onMouseLeave={() => animateOn === 'hover' && setIsHovering(false)}
    >
      {displayText.split('').map((char, index) => {
        const isRevealed = revealedIndices.has(index) || !isScrambling;
        return (
          <span
            key={index}
            className={isRevealed ? className : encryptedClassName}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};
