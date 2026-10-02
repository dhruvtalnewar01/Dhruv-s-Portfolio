import React, { useRef } from 'react';

/**
 * SpotlightHero Component
 * 
 * High-performance, 60fps/120fps interactive "Spotlight Reveal" Hero Background.
 * Uses direct DOM manipulation on CSS variables (--mouse-x, --mouse-y) to eliminate
 * React re-render lag. Applies a radial-gradient mask to reveal the top layer (Batman)
 * over the base layer (Dhruv) smoothly.
 */
export const SpotlightHero: React.FC = () => {
  // References for zero-rerender DOM mutations
  const containerRef = useRef<HTMLDivElement>(null);
  const revealImgRef = useRef<HTMLImageElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  /**
   * Calculates cursor/touch position relative to the container and updates
   * CSS variables on the container DOM node directly.
   */
  const updateCoordinates = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  // Interaction Handlers (Desktop)
  const handleMouseEnter = () => {
    if (revealImgRef.current) revealImgRef.current.style.opacity = '1';
    if (cursorRef.current) cursorRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (revealImgRef.current) revealImgRef.current.style.opacity = '0';
    if (cursorRef.current) cursorRef.current.style.opacity = '0';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateCoordinates(e.clientX, e.clientY);
    // Safety check to ensure visibility if mouse entered without triggering onMouseEnter
    if (revealImgRef.current && revealImgRef.current.style.opacity !== '1') {
      revealImgRef.current.style.opacity = '1';
    }
    if (cursorRef.current && cursorRef.current.style.opacity !== '1') {
      cursorRef.current.style.opacity = '1';
    }
  };

  // Interaction Handlers (Mobile / Touch)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
      if (revealImgRef.current) revealImgRef.current.style.opacity = '1';
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    if (revealImgRef.current) revealImgRef.current.style.opacity = '0';
    if (cursorRef.current) cursorRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full min-h-screen overflow-hidden bg-black cursor-none select-none"
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
      } as React.CSSProperties}
    >
      {/* 1. Base Image (Bottom Layer): Dhruv */}
      <img
        src="/Dhruv.jpeg"
        alt="Dhruv Base Layer"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* 2. Reveal Image (Top Layer): Batman with Radial Mask */}
      <img
        ref={revealImgRef}
        src="/Batman_Upgrade.jpeg"
        alt="Batman Upgrade Reveal Layer"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 transition-opacity duration-300 ease-out"
        style={{
          WebkitMaskImage: 'radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 80%, transparent 100%)',
          maskImage: 'radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 80%, transparent 100%)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      />

      {/* 3. Custom Cursor (20px border-only white circle tracking the spotlight) */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-5 h-5 rounded-full border border-white/80 opacity-0 transition-opacity duration-300 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
        style={{
          transform: 'translate3d(calc(var(--mouse-x, -100px) - 10px), calc(var(--mouse-y, -100px) - 10px), 0)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
