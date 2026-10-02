import React from 'react';

export const GtaVApp: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#070709] p-4 sm:p-6 overflow-hidden select-none relative group">
      {/* Subtle ambient backlight glow matching GTA V artwork */}
      <div 
        className="absolute inset-4 rounded-2xl opacity-20 pointer-events-none blur-3xl scale-95"
        style={{
          background: 'radial-gradient(circle at center, rgba(234, 179, 8, 0.4) 0%, rgba(239, 68, 68, 0.3) 50%, transparent 80%)'
        }}
      />

      {/* Natural, un-cutout, un-zoomed GTA V artwork */}
      <img
        src="/gtav.jpg"
        alt="Grand Theft Auto V"
        className="relative z-10 max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
        draggable={false}
      />
    </div>
  );
};
