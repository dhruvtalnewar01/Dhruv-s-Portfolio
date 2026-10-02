import React from 'react';
import { ownerProfile } from '../ownerProfile';
import { PhoneCall } from 'lucide-react';

export const FoldedCorner = () => {
  return (
    <a 
      href={ownerProfile.conversion.primaryUrl}
      className="absolute bottom-0 right-0 w-32 h-32 z-40 group cursor-pointer"
    >
      <div className="absolute bottom-0 right-0 w-full h-full bg-blue-600 rounded-tl-full shadow-2xl origin-bottom-right transition-transform group-hover:scale-110 flex items-center justify-center pt-8 pl-8">
        <div className="flex flex-col items-center text-white rotate-[-45deg] mr-4 mb-4">
          <PhoneCall size={20} className="mb-1" />
          <span className="text-xs font-bold whitespace-nowrap">Book a call</span>
        </div>
      </div>
    </a>
  );
};
