import React from 'react';

export const ServicesApp: React.FC = () => {
  return (
    <div className="w-full h-full bg-black overflow-hidden relative pointer-events-auto">
      <iframe
        src="/services/index.html"
        className="w-full h-full border-none block"
        title="Services Archive by Dhruv Talnewar"
        allow="autoplay; fullscreen"
      />
    </div>
  );
};
