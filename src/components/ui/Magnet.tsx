import React, { useRef, useState, useEffect } from 'react';

interface MagnetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  strength?: number;
}

export const Magnet = ({ children, strength = 0.5, className, ...props }: MagnetProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const { clientX, clientY } = e;
      const { width, height, left, top } = ref.current.getBoundingClientRect();
      
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      
      // Calculate max distance threshold (using width/height of the element + padding)
      const threshold = Math.max(width, height) * 1.5;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      if (distance < threshold) {
        setPosition({
          x: distanceX * strength,
          y: distanceY * strength
        });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform',
        transition: position.x === 0 && position.y === 0 
          ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' 
          : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};
