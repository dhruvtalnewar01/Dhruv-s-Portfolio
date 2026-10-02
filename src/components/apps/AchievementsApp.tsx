import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  "1. Won the \"Lyzr AI\" Hackathon, Won 4 National level hackathons.",
  "2. Got selected among the top builders for the Junction 2026: European Tech Renaissance.",
  "3. National Finalist, AWS AI for Bharat Hackathon 2026. Regional Finalist, AMD Slingshot Hackathon 2026 (Pune), Top 5, Nirman Hackathon 2026 (Amity).",
  "4. Pitched my AI and VR fashion-tech concept startup to VC’s and Investors at IIT Bombay for the E-Summit 2025.",
  "5. Certifications - Oracle Agentic AI Certified Foundations Associate, Lyzr Agent Studio and Architect, AWS Fundamentals of ML & Advanced Artifical Intelligence, Google Startup School."
];

export const AchievementsApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const textsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const scroller = scrollerRef.current;
    
    if (!canvas || !ctx || !scroller) return;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (typeof render === 'function') render();
    };
    
    window.addEventListener('resize', resizeCanvas);

    const frameCount = 200;
    const currentFrame = (index: number) => (
      `/achievements/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`
    );

    const images: HTMLImageElement[] = [];
    const imageSeq = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      const frameIdx = Math.round(imageSeq.frame);
      if (images[frameIdx] && images[frameIdx].complete) {
        const img = images[frameIdx];
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, x, y;
        
        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          x = 0;
          y = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.height * imgRatio;
          drawHeight = canvas.height;
          x = (canvas.width - drawWidth) / 2;
          y = 0;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      }
    };

    // Initial resize to set canvas dimensions correctly
    resizeCanvas();

    images[0].onload = render;

    // Wait a tick for layout
    setTimeout(() => {
      // 1. Canvas Sequence Scrub
      gsap.to(imageSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          scroller: scroller,
          trigger: ".scroll-trigger-area",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        onUpdate: render
      });

      // 2. Texts 3D animations
      textsRef.current.forEach((text, i) => {
        if (!text) return;
        
        const startTime = i / achievements.length;
        const duration = 0.12; 
        
        // Setup initial 3D transforms
        gsap.set(text, {
           opacity: 0, 
           y: 100, 
           z: -200, 
           rotationX: 20,
           rotationY: i % 2 === 0 ? -20 : 20,
           transformPerspective: 1000 
        });

        // Fade in
        gsap.to(text, {
          opacity: 1, 
          y: 0, 
          z: 0, 
          rotationX: 0,
          rotationY: 0,
          scrollTrigger: {
            scroller: scroller,
            trigger: ".scroll-trigger-area",
            start: `${startTime * 100}% top`,
            end: `${(startTime + duration) * 100}% top`,
            scrub: 1
          }
        });
        
        // Fade out
        gsap.to(text, {
            opacity: 0,
            y: -100,
            z: 100,
            rotationX: -20,
            scrollTrigger: {
              scroller: scroller,
              trigger: ".scroll-trigger-area",
              start: `${(startTime + duration + 0.04) * 100}% top`,
              end: `${(startTime + duration + 0.12) * 100}% top`,
              scrub: 1
            }
        });

        // Continuous floating
        gsap.to(text, {
          y: "+=20",
          rotationZ: i % 2 === 0 ? 1 : -1,
          duration: 2.5 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
      
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div 
      className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-black text-white pointer-events-auto" 
      id="achievements-scroller" 
      ref={scrollerRef}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="relative w-full scroll-trigger-area" style={{ height: '500vh' }}>
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
          
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
             {achievements.map((text, i) => (
                <div 
                  key={i}
                  ref={(el) => { textsRef.current[i] = el; }}
                  className={`absolute w-[80%] md:w-[50%] lg:w-[40%] p-8 md:p-10 font-bold opacity-0 leading-relaxed tracking-wide shadow-2xl`}
                  style={{
                     left: i % 2 === 0 ? '8%' : 'auto',
                     right: i % 2 === 0 ? 'auto' : '8%',
                     top: '50%',
                     transform: 'translateY(-50%)',
                     textShadow: "0px 10px 30px rgba(0,0,0,0.8), 0px 4px 10px rgba(255,255,255,0.2)",
                     backdropFilter: "blur(16px) saturate(180%)",
                     WebkitBackdropFilter: "blur(16px) saturate(180%)",
                     backgroundColor: "rgba(10, 10, 10, 0.4)",
                     borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                     borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
                     borderRight: "1px solid rgba(255, 255, 255, 0.05)",
                     borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                     borderRadius: "24px",
                     transformStyle: "preserve-3d",
                     fontSize: 'clamp(1.1rem, 2vw, 1.6rem)'
                  }}
                >
                  <div className="absolute inset-0 rounded-[24px] pointer-events-none" style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.4) 100%)",
                    mixBlendMode: "overlay"
                  }}></div>
                  <span className="relative z-10 drop-shadow-xl text-white/90">{text}</span>
                </div>
             ))}
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce pointer-events-none">
            <span className="text-xs tracking-widest uppercase font-pixel text-white">Scroll to Explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};
