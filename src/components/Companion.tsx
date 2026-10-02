import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ownerProfile } from '../ownerProfile';

export const Companion = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Calculate 3D rotation based on mouse position over the whole window
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // Reverse direction for realistic head tracking feel
      x.set((e.clientX - centerX) / 30);
      y.set((e.clientY - centerY) / 30);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  // Subtle breathing animation
  const breatheY = [0, -15, 0];

  return (
    <div className="fixed bottom-0 right-0 z-40 pointer-events-none" style={{ perspective: '1000px' }}>
      <motion.div
        style={{ rotateX: y, rotateY: x, transformOrigin: "bottom center" }}
        animate={{ y: breatheY }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative origin-bottom"
      >
        {/* The 4K 3D Anime Boy Model */}
        <img 
          src="/assets/anime_boy_3d.png" 
          alt="3D Anime Boy" 
          className="h-[450px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] filter contrast-125 saturate-125"
          style={{ transformStyle: 'preserve-3d' }}
        />
        
        {/* Dynamic Shadow underneath character */}
        <motion.div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/50 blur-xl rounded-full"
          animate={{ scale: [1, 0.9, 1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};
