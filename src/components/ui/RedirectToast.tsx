import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Music } from 'lucide-react';
import type { RedirectEventDetail } from '../../utils/launchExternal';

export const RedirectToast: React.FC = () => {
  const [toast, setToast] = useState<RedirectEventDetail | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handleRedirect = (e: Event) => {
      const customEvent = e as CustomEvent<RedirectEventDetail>;
      if (customEvent.detail) {
        setToast(customEvent.detail);
        clearTimeout(timer);
        timer = setTimeout(() => {
          setToast(null);
        }, 2200);
      }
    };

    window.addEventListener('os:redirect', handleRedirect);
    return () => {
      window.removeEventListener('os:redirect', handleRedirect);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[999999] pointer-events-none"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/85 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              toast.type === 'youtube' ? 'bg-red-600/90 text-white' : 'bg-emerald-500/90 text-black'
            } shadow-md`}>
              {toast.type === 'youtube' ? (
                <Play size={12} fill="currentColor" />
              ) : (
                <Music size={12} fill="currentColor" />
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-sans font-medium text-white tracking-wide">
                Opening {toast.name}...
              </span>
              <span className={`w-2 h-2 rounded-full ${
                toast.type === 'youtube' ? 'bg-red-500' : 'bg-emerald-400'
              } animate-ping`} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
