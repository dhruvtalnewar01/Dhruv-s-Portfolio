import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const FounderApp = () => {
  return (
    <div 
      className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center pointer-events-auto"
      style={{ perspective: 1200, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Ambient 3D Glow Orbs */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-[120px] bg-purple-600/30 pointer-events-none"
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -60, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[150px] bg-blue-600/20 pointer-events-none"
      />

      {/* 3D Static PDF Container */}
      <motion.div 
        className="relative w-[90%] md:w-[80%] lg:w-[70%] h-[85vh] rounded-2xl shadow-2xl overflow-hidden z-10"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.1) inset"
        }}
      >
        {/* Glassmorphism Border & Backing */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 z-0 rounded-2xl"></div>

        {/* 4K PDF Viewer */}
        <div className="absolute inset-[2px] rounded-2xl overflow-hidden bg-black/80 z-10">
          <iframe 
            src="/Dhruv_Talnewar.pdf#toolbar=0&view=FitH" 
            className="w-full h-full border-none"
            title="Resume"
          />
        </div>
      </motion.div>

      {/* Download CTA Button */}
      <motion.a
        href="/Dhruv_Talnewar.pdf"
        download="Dhruv_Talnewar.pdf"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-12 right-12 z-20 flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium tracking-wide shadow-lg cursor-pointer"
        style={{
          textShadow: "0 2px 10px rgba(0,0,0,0.5)"
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Download Resume</span>
      </motion.a>
    </div>
  );
};
