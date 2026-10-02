import React from 'react';
import { clsx } from 'clsx';

export const LiveProjectButton = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button 
      className={clsx(
        "relative overflow-hidden rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 group/btn",
        "px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children || "Live Project"}
      </span>
      {/* Sparkle / Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:animate-[shimmer_1s_infinite] skew-x-12" />
    </button>
  );
};
