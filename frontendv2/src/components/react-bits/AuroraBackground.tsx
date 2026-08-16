import React from 'react';
import { cn } from '../../lib/utils';

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col min-h-screen items-center justify-center bg-[#05070e] text-slate-100 transition-bg',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,#0a0d18_0%,#0a0d18_7%,transparent_10%,transparent_12%,#0a0d18_16%)]
            [--aurora:repeating-linear-gradient(100deg,#3b82f6_10%,#8b5cf6_18%,#06b6d4_25%,#6366f1_32%,#3b82f6_40%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[28px] invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-40 will-change-transform`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_75%)]`
          )}
          style={{
            animation: 'aurora 60s linear infinite',
          }}
        />
      </div>
      {children}
    </div>
  );
};
