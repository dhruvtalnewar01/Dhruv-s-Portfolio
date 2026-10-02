import React from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassTimeCapsule } from './ui/GlassTimeCapsule';

export const TopUI = () => {
  const { windows } = useStore();

  // Hide completely when ANY application is open
  const hasOpenWindows = windows.some(w => w.isOpen && !w.isMinimized);
  if (hasOpenWindows) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        className="absolute top-6 left-0 w-full z-50 pointer-events-auto flex items-center justify-between px-6 sm:px-10 md:px-16 font-sans"
      >
        {/* Left Section: 3D Glassmorphic Live Time & Date Animation */}
        <div className="flex-1 flex justify-start items-center">
          <GlassTimeCapsule />
        </div>

        {/* Center Section: Name in elegant cursive font */}
        <div className="flex-1 flex justify-center items-center pointer-events-none">
          <span 
            className="text-white text-[30px] sm:text-[36px] font-normal tracking-[0.02em] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-none pt-1"
            style={{ fontFamily: '"Arizonia", cursive' }}
          >
            Dhruv Talnewar
          </span>
        </div>

        {/* Right Section: Let's chat redirecting to Gmail */}
        <div className="flex-1 flex justify-end items-center">
          <a 
            href="mailto:dtalnewar@gmail.com"
            className="group/chat relative flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[13px] font-medium tracking-wide text-white/90 hover:text-white transition-all duration-300 backdrop-blur-xl border border-white/15 hover:border-blue-400/40 bg-white/[0.05] hover:bg-blue-500/[0.12] shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.3)] active:scale-95 cursor-pointer"
          >
            <span className="relative z-10 font-sans tracking-wider uppercase text-xs">Let's chat</span>
            <span className="relative z-10 text-[15px] leading-none transition-transform duration-300 group-hover/chat:translate-x-1 text-blue-400">→</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-blue-400/15 to-transparent opacity-0 group-hover/chat:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
