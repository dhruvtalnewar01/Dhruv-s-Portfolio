import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const GlassTimeCapsule: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const ref = useRef<HTMLDivElement>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Time: e.g. "07:42 PM"
  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Format Date: e.g. "FRI, OCT 2"
  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).toUpperCase();

  // 3D Tilt interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 25 });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 25 });
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['25%', '75%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['20%', '65%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      className="relative perspective-1000 select-none group/capsule"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic 3D Chromatic Caustic Glow behind glass (Deep Sapphire & Midnight Blue halo) */}
      <div 
        className="absolute -inset-1 rounded-full opacity-75 group-hover/capsule:opacity-100 blur-md transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(37, 99, 235, 0.6) 0%, rgba(30, 58, 138, 0.4) 60%, transparent 100%)',
          transform: 'translateY(1px) scale(0.98)'
        }}
      />

      {/* Main 3D Glass Capsule Container */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: 'preserve-3d'
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative flex items-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full cursor-pointer overflow-hidden backdrop-blur-2xl transition-all duration-300"
      >
        {/* Deep Refractive Dark Blue Glass Background */}
        <div 
          className="absolute inset-0 rounded-full z-0"
          style={{
            background: 'linear-gradient(165deg, rgba(8, 18, 38, 0.95) 0%, rgba(3, 8, 20, 0.98) 100%)',
            boxShadow: `
              inset 0 1.2px 1.5px 0 rgba(255, 255, 255, 0.85),
              inset 0 -1.5px 3px 0 rgba(0, 0, 0, 0.9),
              inset 0 0 14px 0 rgba(37, 99, 235, 0.4),
              0 6px 18px -2px rgba(0, 0, 0, 0.8),
              0 0 14px 0 rgba(59, 130, 246, 0.35)
            `,
            border: '1px solid rgba(96, 165, 250, 0.35)'
          }}
        />

        {/* Curvature Specular Reflection Arc (Glossy Upper Dome) */}
        <div 
          className="absolute top-0 left-[6%] right-[6%] h-[46%] rounded-t-full opacity-80 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.15) 60%, rgba(255, 255, 255, 0) 100%)',
            filter: 'blur(0.4px)'
          }}
        />

        {/* Dynamic Interactive Glare that follows cursor */}
        <motion.div 
          className="absolute inset-0 pointer-events-none rounded-full z-10 mix-blend-overlay opacity-40 group-hover/capsule:opacity-75 transition-opacity duration-300"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.15) 35%, transparent 65%)`
            )
          }}
        />

        {/* Single-Line Live Time & Date */}
        <div className="relative z-20 flex items-center gap-2.5 font-sans tracking-wide">
          <span className="text-[13px] sm:text-[13.5px] font-bold text-white tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {formattedTime}
          </span>
          
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] animate-pulse" />

          <span className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.06em] text-[#93C5FD]/85 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {formattedDate}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
