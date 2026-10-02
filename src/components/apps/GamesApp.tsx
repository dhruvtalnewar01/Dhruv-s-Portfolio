import React from 'react';

export const GamesApp: React.FC = () => {
  return (
    <div className="w-full h-full bg-black overflow-hidden relative pointer-events-auto">
      <iframe
        src="/games/index.html"
        className="w-full h-full border-none block"
        title="Vault-Tec Terminal Hacking Arcade"
        allow="autoplay; fullscreen"
      />
    </div>
  );
};
