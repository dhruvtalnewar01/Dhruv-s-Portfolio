import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const ContactApp = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mouse scrubbing & mobile autoplay hook
  useEffect(() => {
    let prevX = window.innerWidth / 2;
    let isSeeking = false;
    let pendingTime: number | null = null;
    
    const video = videoRef.current;
    if (!video) return;

    if (window.innerWidth < 1024) {
      video.autoplay = true;
      video.play().catch(console.error);
    }

    const handleSeeked = () => {
      isSeeking = false;
      if (pendingTime !== null) {
        video.currentTime = pendingTime;
        isSeeking = true;
        pendingTime = null;
      }
    };

    video.addEventListener('seeked', handleSeeked);

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (!video.duration) return;

      const delta = e.clientX - prevX;
      prevX = e.clientX;

      let targetTime = video.currentTime + (delta / window.innerWidth) * 0.8 * video.duration;
      targetTime = Math.max(0, Math.min(targetTime, video.duration));
      
      if (!isSeeking) {
        video.currentTime = targetTime;
        isSeeking = true;
      } else {
        pendingTime = targetTime;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative w-full min-h-screen bg-white text-black font-sans overflow-hidden antialiased flex flex-col justify-center">
      
      {/* Layer 0: Background Video (Strictly Absolute) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video 
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
          muted 
          playsInline 
          preload="auto"
          className="w-full h-full object-cover object-center opacity-90"
        />
      </div>

      {/* Layer 1: Content Overlay (Strictly Relative) */}
      <div className="relative z-10 w-full flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-12">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Sized perfectly to mimic the original text block's physical footprint */}
          <img 
            src="/contact_text.jpeg" 
            alt="Contact Information" 
            className="h-auto object-contain object-left mix-blend-multiply opacity-95 select-none pointer-events-none -ml-1 md:-ml-2"
            style={{ width: '100%', maxWidth: '400px' }}
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-5"
        >
          <motion.a
            variants={itemVariants}
            href="https://wa.me/919860486657"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-black text-white font-semibold tracking-wide shadow-xl hover:bg-neutral-800 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer text-sm md:text-base"
          >
            WhatsApp
          </motion.a>
          <motion.a
            variants={itemVariants}
            href="mailto:dtalnewar@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-black text-white font-semibold tracking-wide shadow-xl hover:bg-neutral-800 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer text-sm md:text-base"
          >
            Gmail
          </motion.a>
          <motion.a
            variants={itemVariants}
            href="https://www.linkedin.com/in/dhruvtalnewarofficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-black text-white font-semibold tracking-wide shadow-xl hover:bg-neutral-800 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer text-sm md:text-base"
          >
            LinkedIn
          </motion.a>
        </motion.div>
        
      </div>
    </div>
  );
};
