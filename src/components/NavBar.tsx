import React, { useEffect, useState } from 'react';
import { ownerProfile } from '../ownerProfile';
import { Signal, Battery, Search, Settings2 } from 'lucide-react';

export const NavBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full h-8 px-4 flex items-center justify-between z-50 glass-header backdrop-blur-3xl text-sm font-medium text-white/90">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 font-semibold cursor-default hover:text-white transition-colors">
          <img src={ownerProfile.identity.sprite} alt="Avatar" className="w-4 h-4 object-cover rounded-full shadow-sm" />
          <span>{ownerProfile.identity.osName}</span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-[13px]">
          <span className="cursor-pointer hover:text-white transition-colors">Work</span>
          <span className="cursor-pointer hover:text-white transition-colors">Proof</span>
          <span className="cursor-pointer hover:text-white transition-colors">Journey</span>
        </div>
      </div>

      <div className="flex items-center gap-5 text-[13px]">
        <div className="flex items-center gap-1.5 text-green-400 font-semibold cursor-pointer">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.8)] animate-pulse"></span>
          Building
        </div>
        
        <div className="flex items-center gap-4 opacity-80 cursor-default hover:opacity-100 transition-opacity">
          <Search size={14} />
          <Settings2 size={14} />
          <Signal size={14} />
          <Battery size={14} />
        </div>
        
        <div className="cursor-default hover:text-white transition-colors">
          <span>{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} </span>
          <span className="ml-1">{time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
        </div>
      </div>
    </nav>
  );
};
