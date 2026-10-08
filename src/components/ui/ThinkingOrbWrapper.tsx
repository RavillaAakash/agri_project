import React from 'react';
import { ThinkingOrb } from 'thinking-orbs';
import type { OrbSize } from 'thinking-orbs';
import type { ThinkingOrbState } from '@/types/agricultural';

interface ThinkingOrbWrapperProps {
  state?: ThinkingOrbState;
  size?: OrbSize;
  label?: string;
  className?: string;
}

export const ThinkingOrbWrapper: React.FC<ThinkingOrbWrapperProps> = ({
  state = 'breathing',
  size = 64,
  label,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Ambient glow behind orb */}
        <div
          className="absolute rounded-full blur-xl opacity-35 bg-emerald-500 pointer-events-none"
          style={{ width: size * 1.2, height: size * 1.2 }}
        />
        <ThinkingOrb state={state} size={size} />
      </div>
      {label && (
        <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 tracking-wide animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};
