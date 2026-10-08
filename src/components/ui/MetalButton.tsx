import React, { useRef } from 'react';
import { MetalFx } from 'metal-fx';

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'circle' | 'accent';
  className?: string;
}

export const MetalButton: React.FC<MetalButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (variant === 'circle') {
    return (
      <MetalFx preset="chromatic" variant="circle" innerShadow>
        <button
          ref={buttonRef}
          className={`w-11 h-11 rounded-full flex items-center justify-center bg-emerald-700 text-white font-medium shadow-lg hover:scale-105 active:scale-95 transition-transform ${className}`}
          {...props}
        >
          {children}
        </button>
      </MetalFx>
    );
  }

  return (
    <MetalFx preset="chromatic" strength={0.8}>
      <button
        ref={buttonRef}
        className={`px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-98 ${
          variant === 'accent'
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-amber-500/20'
            : 'bg-gradient-to-r from-emerald-800 to-emerald-600 text-white shadow-emerald-900/30 hover:brightness-110'
        } ${className}`}
        {...props}
      >
        {children}
      </button>
    </MetalFx>
  );
};
