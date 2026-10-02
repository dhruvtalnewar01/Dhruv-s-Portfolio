import React, { useRef } from 'react';
import { useStore } from '../store/useStore';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { clsx } from 'clsx';
import { Trophy, Compass, Radio } from 'lucide-react';

const DockItem = ({ app, active, mouseX }: any) => {
  const { openWindow } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  
  // Calculate distance from mouse for fisheye effect
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Transform distance into scale (closer = bigger)
  const scaleSync = useTransform(distance, [-100, 0, 100], [1, 1.4, 1]);
  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 200, damping: 15 });

  return (
    <div className="flex flex-col items-center gap-1 group relative">
      {/* Tooltip */}
      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-black font-surfer text-[12px] px-3 py-1 rounded-md shadow-md border border-white/50 whitespace-nowrap pointer-events-none z-50">
        {app.label}
      </div>

      <motion.div
        ref={ref}
        style={{ scale }}
        whileTap={{ scale: 0.88 }}
        onClick={() => openWindow(app.id, app.label)}
        className="w-9 h-9 flex items-center justify-center cursor-pointer origin-bottom transition-transform hover:z-50"
      >
        <img src={app.iconSrc} alt={app.label} className="w-full h-full object-contain drop-shadow-lg" draggable={false} />
      </motion.div>
      
      {/* Active Dot */}
      <div className={clsx("w-1 h-1 rounded-full mt-0.5", active ? "bg-black/60 shadow-[0_0_2px_rgba(0,0,0,0.3)]" : "bg-transparent")} />
    </div>
  );
};

export const Dock = () => {
  const { windows } = useStore();
  const mouseX = useMotionValue(Infinity);

  const hasOpenWindows = windows.some(w => w.isOpen && !w.isMinimized);
  if (hasOpenWindows) return null;

  const dockApps = [
    { id: 'founder', label: 'Founder.txt', iconSrc: 'https://img.icons8.com/3d-fluency/512/document.png' },
    { id: 'contact', label: 'Contact', iconSrc: '/assets/mail_3d_1786454921675.png' },
    { id: 'services', label: 'Services', iconSrc: 'https://img.icons8.com/3d-fluency/512/briefcase.png' },
    { id: 'music', label: 'Music', iconSrc: '/assets/music_3d.jpg' },
    { id: 'notepad', label: 'Notepad', iconSrc: '/assets/notes_3d.jpg' },
  ];

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
      <motion.div 
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-3 px-4 pt-2 pb-1.5 rounded-[1.5rem] bg-black/25 backdrop-blur-[50px] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]"
      >
        {dockApps.map((app) => {
          const win = windows.find(w => w.id === app.id);
          const isActive = win?.isOpen && !win?.isMinimized;
          const isMin = win?.isOpen && win?.isMinimized;

          return <DockItem key={app.id} app={app} active={isActive || isMin} mouseX={mouseX} />;
        })}
        
        {/* Separator */}
        <div className="w-[1px] h-8 bg-black/10 mx-1.5 my-1" />
        
        {/* Trash */}
        <DockItem 
          app={{ id: 'trash', label: 'Trash', iconSrc: 'https://img.icons8.com/3d-fluency/512/trash.png' }} 
          active={false} 
          mouseX={mouseX} 
        />
      </motion.div>
    </div>
  );
};
