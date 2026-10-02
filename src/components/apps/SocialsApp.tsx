import React from 'react';
import { ownerProfile } from '../../ownerProfile';
import { Globe, Code, Mail, Phone } from 'lucide-react';

export const SocialsApp = () => {
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Connect with me</h2>
      
      <a href={ownerProfile.socials.find(s => s.name === 'LinkedIn')?.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-white/50 dark:bg-black/50 border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/80 dark:hover:bg-black/80 transition-colors">
        <Globe size={24} className="text-blue-600" />
        <div>
          <div className="font-bold text-lg">LinkedIn</div>
          <div className="text-sm opacity-70">Professional Network</div>
        </div>
      </a>

      <a href={ownerProfile.socials.find(s => s.name === 'GitHub')?.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-white/50 dark:bg-black/50 border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/80 dark:hover:bg-black/80 transition-colors">
        <Code size={24} />
        <div>
          <div className="font-bold text-lg">GitHub</div>
          <div className="text-sm opacity-70">Open Source & Projects</div>
        </div>
      </a>

      <a href={ownerProfile.conversion.primaryUrl} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-black/50 border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/80 dark:hover:bg-black/80 transition-colors">
        <Mail size={24} className="text-red-500" />
        <div>
          <div className="font-bold text-lg">Email</div>
          <div className="text-sm opacity-70">{ownerProfile.conversion.email}</div>
        </div>
      </a>
      
      <a href={ownerProfile.conversion.whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-white/50 dark:bg-black/50 border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/80 dark:hover:bg-black/80 transition-colors">
        <Phone size={24} className="text-green-500" />
        <div>
          <div className="font-bold text-lg">WhatsApp</div>
          <div className="text-sm opacity-70">Fast Response Channel</div>
        </div>
      </a>
    </div>
  );
};
