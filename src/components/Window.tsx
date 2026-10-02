import React from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';
import { Minus, Square, X } from 'lucide-react';

export const Window = ({ id, title, children, zIndex, isMaximized, isBorderless }: any) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useStore();
  const controls = useDragControls();

  return (
    <AnimatePresence>
      <motion.div
        drag={!isMaximized}
        dragControls={controls}
        dragListener={false}
        dragMomentum={false}
        onMouseDown={() => focusWindow(id)}
        style={{ zIndex }}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={clsx(
          "absolute flex flex-col overflow-hidden pointer-events-auto",
          isBorderless ? 'bg-black border border-white/10' : 'glass-window',
          isMaximized ? "inset-0 w-full h-full rounded-none border-none" : "w-[800px] h-[550px] top-[10%] left-[20%] rounded-xl"
        )}
      >
        {isBorderless ? (
          <div className="absolute top-5 md:top-6 left-5 md:left-6 flex items-center gap-2 z-[9999] group" onPointerDown={(e) => { e.stopPropagation(); }}>
            <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }} className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-inner flex items-center justify-center transition-all hover:brightness-110 cursor-pointer" aria-label="Close">
              <X size={8} className="text-black/60 opacity-0 group-hover:opacity-100" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-inner flex items-center justify-center transition-all hover:brightness-110 cursor-pointer" aria-label="Minimize">
              <Minus size={8} className="text-black/60 opacity-0 group-hover:opacity-100" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }} className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-inner flex items-center justify-center transition-all hover:brightness-110 cursor-pointer" aria-label="Maximize">
              <Square size={6} className="text-black/60 opacity-0 group-hover:opacity-100" />
            </button>
          </div>
        ) : (
          <div 
            className="h-12 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing glass-header relative group flex-shrink-0"
            onPointerDown={(e) => controls.start(e)}
          >
            <div className="flex items-center gap-2 z-10">
              <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }} className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-inner flex items-center justify-center transition-all hover:brightness-110 cursor-pointer">
                <X size={8} className="text-black/60 opacity-0 group-hover:opacity-100" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-inner flex items-center justify-center transition-all hover:brightness-110 cursor-pointer">
                <Minus size={8} className="text-black/60 opacity-0 group-hover:opacity-100" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }} className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-inner flex items-center justify-center transition-all hover:brightness-110 cursor-pointer">
                <Square size={6} className="text-black/60 opacity-0 group-hover:opacity-100" />
              </button>
            </div>
            
            <div className="font-semibold text-xs tracking-wide absolute left-1/2 -translate-x-1/2 text-white/90 drop-shadow-md">
              {title}
            </div>
            
            <div className="w-16" />
          </div>
        )}
        
        <div className={clsx("flex-1 overflow-auto p-0 text-gray-100 relative", !isBorderless && "bg-white/5")}>
          {isBorderless && !isMaximized && (
            <div className="absolute top-0 left-20 right-0 h-12 z-[9990] cursor-grab active:cursor-grabbing" onPointerDown={(e) => controls.start(e)} />
          )}
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
