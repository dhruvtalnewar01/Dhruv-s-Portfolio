import React from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const AppIcon = ({ app, index, initialX, initialY }: { app: any, index: number, initialX: number, initialY: number }) => {
  const { openWindow } = useStore();

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: initialX, y: initialY }}
      onClick={(e) => {
        e.stopPropagation();
        openWindow(app.id, app.label);
      }}
      className="absolute top-0 left-0 flex flex-col items-center gap-2 w-20 cursor-pointer group z-10 pointer-events-auto"
      whileHover={{ scale: 1.1, rotateY: 15, rotateX: 10 }}
      whileTap={{ scale: 0.92 }}
    >
      <div className="relative">
        {app.badge && (
          <div className="absolute -top-3 -right-4 bg-red-500 text-white rounded-full text-[9px] font-surfer font-bold px-2 py-0.5 whitespace-nowrap z-20 shadow-[0_4px_10px_rgba(239,68,68,0.5)] border border-white/20 backdrop-blur-md">
            {app.badge}
          </div>
        )}
        <div 
          className={clsx(
            "w-11 h-11 flex items-center justify-center relative rounded-xl",
            app.bgImage ? "bg-black/40" : "bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-500",
            "shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)]",
            "transition-all duration-300 overflow-hidden",
            "group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.6),inset_0_4px_8px_rgba(255,255,255,0.6)]",
            "text-white"
          )}
        >
          {app.bgImage ? (
            <img src={app.bgImage} draggable={false} className="w-full h-full object-cover rounded-xl pointer-events-none" alt={app.label} />
          ) : (
            <>
              {/* 3D Glossy Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/60 opacity-80 rounded-[1rem] pointer-events-none mix-blend-overlay" />
              <div className="relative z-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.6)]">
                {app.icon}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="text-center w-full flex flex-col items-center pointer-events-none">
        <div className="text-[12px] font-surfer tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] px-1 mt-1">
          {app.label}
        </div>
      </div>
    </motion.div>
  );
};
