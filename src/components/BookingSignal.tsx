import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BookingSignal = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute bottom-8 left-8 w-80 retro-window z-40"
        >
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700 px-2 py-1 text-[9px] font-bold uppercase tracking-wider border-2 border-green-800 bg-green-200">
                <span className="w-1.5 h-1.5 bg-green-500 border border-green-900 animate-pulse" />
                BOOKING SIGNAL
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="w-5 h-5 flex items-center justify-center border-2 border-[#2B211B] bg-red-500 text-white font-bold text-[10px] hover:bg-red-400"
              >
                X
              </button>
            </div>
            <p className="text-[10px] font-medium leading-snug">
              Someone just booked a call with Dhruv. Looks like they don't want their business getting behind on AI.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
