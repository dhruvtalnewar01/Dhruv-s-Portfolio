import React, { useState, useEffect, useRef } from 'react';
import { Flower2 } from 'lucide-react';

export const VoiceAIApp: React.FC = () => {
  const [isNavMounted, setIsNavMounted] = useState(false);
  const [isHeroMounted, setIsHeroMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set page title
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Cheapest Voice AI";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  // Entrance triggers
  useEffect(() => {
    const navTimer = setTimeout(() => {
      setIsNavMounted(true);
    }, 100);

    const heroTimer = setTimeout(() => {
      setIsHeroMounted(true);
    }, 300);

    return () => {
      clearTimeout(navTimer);
      clearTimeout(heroTimer);
    };
  }, []);

  // Scroll detection (supports both window scroll and container scroll)
  useEffect(() => {
    const handleScroll = () => {
      const containerScroll = containerRef.current ? containerRef.current.scrollTop : 0;
      const windowScroll = window.scrollY || 0;
      setIsScrolled(containerScroll > 40 || windowScroll > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const ENTRANCE_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-screen bg-black text-white overflow-x-hidden selection:bg-white selection:text-black"
      style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}
    >
      {/* NAVBAR (fixed) */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
          {/* Left — logo with Original Surfer font */}
          <div
            className="flex items-center transition-all duration-700"
            style={{
              opacity: isNavMounted ? 1 : 0,
              transform: isNavMounted ? 'translateY(0)' : 'translateY(-1rem)',
              transitionTimingFunction: ENTRANCE_EASE,
              transitionDelay: isNavMounted ? '0ms' : '0ms',
            }}
          >
            <a
              href="#"
              className="text-white text-xl md:text-2xl font-surfer tracking-wide z-50 ml-16 md:ml-20 cursor-pointer hover:opacity-85 transition-opacity drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              Dhruv's Voice AI
            </a>
          </div>

          {/* Right — Flower2 icon */}
          <div
            className="flex items-center transition-all duration-700"
            style={{
              opacity: isNavMounted ? 1 : 0,
              transform: isNavMounted ? 'translateY(0)' : 'translateY(-1rem)',
              transitionTimingFunction: ENTRANCE_EASE,
              transitionDelay: isNavMounted ? '200ms' : '0ms',
            }}
          >
            <Flower2 className="w-7 h-7 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
          </div>
        </div>
      </header>

      {/* HERO (full viewport) */}
      <section className="relative w-full h-screen overflow-hidden flex items-end justify-center">
        {/* Background video wrapper */}
        <div
          className={`absolute inset-0 transition-all duration-[1400ms] ${
            isHeroMounted ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
          }`}
          style={{ transitionTimingFunction: ENTRANCE_EASE }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Foreground (bottom-centered) */}
        <div className="relative z-10 text-center px-6 pb-16 md:pb-24 max-w-4xl mx-auto flex flex-col items-center">
          {/* H1 (Instrument Serif) */}
          <h1
            className={`font-instrument text-white text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl mb-5 md:mb-6 transition-all duration-900 ${
              isHeroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: ENTRANCE_EASE,
              transitionDelay: isHeroMounted ? '400ms' : '0ms',
            }}
          >
            Speak more. Burn less<br className="hidden sm:block" /> We made Voice AI ruthless
          </h1>

          {/* Subcopy - Single line, bold, clearly visible */}
          <p
            className={`font-sans font-semibold text-white/95 text-base sm:text-lg md:text-xl tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] mb-8 md:mb-10 max-w-3xl mx-auto whitespace-nowrap transition-all duration-900 ${
              isHeroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: ENTRANCE_EASE,
              transitionDelay: isHeroMounted ? '600ms' : '0ms',
            }}
          >
            The new architecture for real-time Cheaper Voice AI.
          </p>

          {/* CTA - Stylish 3D Interactive Button with Depth, Shimmer & Glow */}
          <div
            className={`transition-all duration-900 ${
              isHeroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: ENTRANCE_EASE,
              transitionDelay: isHeroMounted ? '800ms' : '0ms',
            }}
          >
            <div className="relative group inline-block">
              {/* Ambient Pulsing 3D Glow Aura */}
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-white/30 via-white/60 to-white/30 opacity-40 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-pulse pointer-events-none" />

              {/* 3D Tactile Button Body */}
              <a
                href="#"
                className="relative inline-flex items-center justify-center px-9 md:px-10 py-3.5 md:py-4 font-sans font-semibold text-neutral-950 tracking-wider text-sm md:text-base rounded-full cursor-pointer select-none transition-all duration-300 ease-out
                  bg-gradient-to-b from-[#ffffff] via-[#f7f7fa] to-[#e4e4ed]
                  border-t border-white
                  border-b-[4px] border-[#9b9bb0]
                  hover:border-b-[5px] hover:border-[#8b8b9f] hover:-translate-y-1
                  active:border-b-[1px] active:translate-y-[3px] active:shadow-[0_4px_12px_rgba(0,0,0,0.6)]
                  shadow-[0_16px_36px_rgba(0,0,0,0.6),0_4px_16px_rgba(255,255,255,0.25),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.12)]
                  hover:shadow-[0_24px_48px_rgba(0,0,0,0.7),0_8px_28px_rgba(255,255,255,0.4),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.12)]"
              >
                {/* Top specular glossy reflection arc */}
                <div className="absolute inset-x-4 top-1 h-[42%] rounded-full bg-gradient-to-b from-white/90 via-white/40 to-transparent pointer-events-none" />

                {/* Animated light sweep effect */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </div>

                {/* Text and subtle pulse beacon */}
                <span className="relative z-10 flex items-center gap-2.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 opacity-30"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neutral-900"></span>
                  </span>
                  <span>Launching Soon</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
