import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mic, MicOff, PhoneOff, Sparkles, Volume2 } from 'lucide-react';
import VapiPackage from '@vapi-ai/web';
import { useStore } from '../../store/useStore';

export type VoiceAIState = 'IDLE' | 'CONNECTING' | 'LISTENING' | 'SPEAKING' | 'DISCONNECTING';

const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || '';
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || '5366650e-13de-438a-8c8b-9e9c61daee69';

export const VoiceAIAssistant: React.FC = () => {
  const [callStatus, setCallStatus] = useState<VoiceAIState>('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const vapiRef = useRef<any>(null);

  const { windows } = useStore();
  const hasOpenWindows = windows.some(w => w.isOpen && !w.isMinimized);

  // 3D cursor tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), { stiffness: 240, damping: 20 });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), { stiffness: 240, damping: 20 });

  // Handle cursor interaction for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Real-time Canvas Rendering with Chroma/Luma Keying (100% True Transparent Background)
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animId: number;

    const render = () => {
      if (video.readyState >= 2) {
        // Continuous loop cutoff before the watermark endcard at 12.2s
        if (video.currentTime >= 12.0) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }

        const w = canvas.width;
        const h = canvas.height;

        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 640;
        // Crop empty outer margin (20% on each side) to scale orb compactly
        const crop = 0.20;
        const sx = vw * crop;
        const sy = vh * crop;
        const sw = vw * (1 - 2 * crop);
        const sh = vh * (1 - 2 * crop);

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const len = data.length;

        // Convert black background pixels to 100% transparent alpha channel
        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const max = Math.max(r, g, b);

          if (max < 16) {
            data[i + 3] = 0; // Completely transparent
          } else {
            // Smooth gradient falloff for glowing edges
            data[i + 3] = Math.min(255, Math.round(((max - 16) / 239) * 255 * 1.15));
          }
        }

        ctx.putImageData(imgData, 0, 0);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Initialize Vapi Client instance safely across ESM and CommonJS
  useEffect(() => {
    if (!VAPI_PUBLIC_KEY) return;
    let vapi: any = null;
    try {
      const VapiClass: any = (VapiPackage as any)?.default || VapiPackage;
      vapi = new VapiClass(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;

      vapi.on('call-start', () => {
        setCallStatus('LISTENING');
        setErrorMessage(null);
        setTranscript("Hello! I'm Rose, Dhruv's AI Assistant. How can I help you?");
      });

      vapi.on('call-end', () => {
        setCallStatus('IDLE');
        setVolume(0);
        setIsMuted(false);
      });

      vapi.on('speech-start', () => {
        setCallStatus('SPEAKING');
      });

      vapi.on('speech-end', () => {
        setCallStatus('LISTENING');
      });

      vapi.on('volume-level', (vol: number) => {
        setVolume(vol);
      });

      vapi.on('message', (message: any) => {
        if (message.type === 'transcript') {
          if (message.role === 'assistant' || message.transcriptType === 'final') {
            setTranscript(message.transcript);
          }
        }
      });

      vapi.on('error', (e: any) => {
        console.error('Vapi client error:', e);
        const errMsg = e?.error?.message || e?.message || 'Voice connection error';
        setErrorMessage(errMsg);
        setCallStatus('IDLE');
      });
    } catch (err) {
      console.error('Failed to instantiate Vapi:', err);
    }

    return () => {
      if (vapi) {
        try {
          vapi.stop();
        } catch {
          // ignore cleanup error
        }
      }
    };
  }, []);

  // Start or Stop Voice Call
  const toggleCall = async () => {
    setErrorMessage(null);

    if (!VAPI_PUBLIC_KEY) {
      setErrorMessage("Vapi Public Key required. Set VITE_VAPI_PUBLIC_KEY in environment.");
      return;
    }

    if (!vapiRef.current) {
      try {
        const VapiClass: any = (VapiPackage as any)?.default || VapiPackage;
        vapiRef.current = new VapiClass(VAPI_PUBLIC_KEY);
      } catch (err: any) {
        console.error('Error instantiating Vapi:', err);
        setErrorMessage("Voice client initialization error");
        return;
      }
    }

    if (callStatus === 'IDLE') {
      try {
        setCallStatus('CONNECTING');
        await vapiRef.current.start(VAPI_ASSISTANT_ID);
      } catch (err: any) {
        console.error('Error starting Vapi call:', err);
        setCallStatus('IDLE');
        setErrorMessage(err?.message || 'Microphone access needed to start Voice AI');
      }
    } else if (callStatus !== 'DISCONNECTING') {
      try {
        setCallStatus('DISCONNECTING');
        await vapiRef.current.stop();
        setCallStatus('IDLE');
      } catch (err) {
        console.error('Error stopping Vapi call:', err);
        setCallStatus('IDLE');
      }
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!vapiRef.current || callStatus === 'IDLE') return;
    const nextMuted = !isMuted;
    try {
      vapiRef.current.setMuted(nextMuted);
      setIsMuted(nextMuted);
    } catch (err) {
      console.error('Failed to toggle mute:', err);
    }
  };

  const isActiveCall = callStatus === 'CONNECTING' || callStatus === 'LISTENING' || callStatus === 'SPEAKING';

  // Keep Voice AI active during call even if apps open; hide if idle to avoid covering open app windows
  if (hasOpenWindows && callStatus === 'IDLE') return null;

  return (
    <div 
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10 z-40 select-none flex flex-col items-end pointer-events-auto"
    >
      {/* Hidden source video feeding the transparent canvas */}
      <video
        ref={videoRef}
        src="/voice-ai-animation.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="fixed -top-96 -left-96 opacity-0 pointer-events-none w-1 h-1"
      />

      {/* 1. Live Speech Bubble Subtitle (Floats directly above when Rose or user speaks) */}
      <AnimatePresence>
        {isActiveCall && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="mb-3 max-w-[280px] sm:max-w-[340px] px-4 py-2.5 rounded-2xl backdrop-blur-xl border border-white/20 bg-black/75 shadow-[0_12px_32px_rgba(0,0,0,0.8)] text-white text-xs sm:text-[13px] leading-relaxed relative"
          >
            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Rose - Voice AI</span>
            </div>
            <p className="text-white/90 font-sans tracking-wide">
              {transcript}
            </p>
            {/* Speech bubble pointer notch */}
            <div className="absolute -bottom-1.5 right-12 w-3 h-3 rotate-45 bg-black/75 border-r border-b border-white/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error notification if mic or connection fails */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-2 max-w-[260px] px-3.5 py-1.5 rounded-xl backdrop-blur-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs shadow-lg flex items-center justify-between gap-2"
          >
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-red-400 hover:text-white font-bold text-sm leading-none"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main 3D Floating Voice AI Orb Component (Compact & Balanced Sizing) */}
      <div className="relative flex flex-col items-center">
        
        {/* Dynamic 3D Caustic Glow behind the Orb (Dark Blue / Sapphire Theme) */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl pointer-events-none transition-all duration-700"
          style={{
            background: callStatus === 'SPEAKING' 
              ? 'radial-gradient(circle, rgba(6, 182, 212, 0.75) 0%, rgba(59, 130, 246, 0.55) 45%, rgba(30, 58, 138, 0.35) 70%, transparent 100%)'
              : callStatus === 'LISTENING'
              ? 'radial-gradient(circle, rgba(37, 99, 235, 0.75) 0%, rgba(30, 58, 138, 0.5) 50%, transparent 75%)'
              : callStatus === 'CONNECTING'
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.65) 0%, rgba(59, 130, 246, 0.45) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(37, 99, 235, 0.55) 0%, rgba(30, 58, 138, 0.35) 50%, transparent 75%)',
            transform: `scale(${callStatus === 'SPEAKING' ? 1.25 + volume * 0.35 : 1.05})`,
            opacity: isActiveCall ? 0.95 : 0.7
          }}
        />

        {/* 3D Holographic Orbit Ring for CONNECTING state */}
        {callStatus === 'CONNECTING' && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0.5 rounded-full border border-dashed border-amber-400/80 pointer-events-none z-10"
            style={{
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.6)',
              transform: 'rotateX(62deg)'
            }}
          />
        )}

        {/* 3D Sonic Reverberation Wave for LISTENING and SPEAKING states */}
        {isActiveCall && (
          <>
            <motion.div
              animate={{ 
                scale: [0.96, 1.16, 1.36],
                opacity: [0.75, 0.3, 0]
              }}
              transition={{ 
                duration: callStatus === 'SPEAKING' ? 1.2 : 2.2, 
                repeat: Infinity, 
                ease: 'easeOut' 
              }}
              className="absolute inset-0.5 rounded-full border border-cyan-400/70 pointer-events-none z-10"
            />
            {callStatus === 'SPEAKING' && (
              <motion.div
                animate={{ 
                  scale: [0.96, 1.28, 1.56],
                  opacity: [0.65, 0.2, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: 'easeOut',
                  delay: 0.35
                }}
                className="absolute inset-0.5 rounded-full border border-blue-400/60 pointer-events-none z-10"
              />
            )}
          </>
        )}

        {/* 3D Interactive Tilting Sphere Container (Slightly more compact size) */}
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={toggleCall}
          style={{
            rotateX: rotateXSpring,
            rotateY: rotateYSpring,
            transformStyle: 'preserve-3d'
          }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
          animate={{
            y: isActiveCall ? [0, -3, 0] : [0, -6, 0]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-[116px] md:h-[116px] rounded-full cursor-pointer flex items-center justify-center group"
          title={isActiveCall ? "Click to disconnect Voice AI" : "Click to speak with Rose - Voice AI"}
        >
          {/* The Pure 100% Transparent Real-time Canvas Rendering (Dark Blue Aura) */}
          <canvas
            ref={canvasRef}
            width={140}
            height={140}
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_16px_rgba(37,99,235,0.45)] transition-all duration-300 group-hover:drop-shadow-[0_0_24px_rgba(96,165,250,0.65)]"
          />

          {/* Volume Pulse Glow Overlay during Speaking */}
          {callStatus === 'SPEAKING' && (
            <motion.div
              className="absolute inset-1.5 rounded-full pointer-events-none mix-blend-screen z-10"
              style={{
                background: 'radial-gradient(circle, rgba(6,182,212,0.6) 0%, rgba(59,130,246,0.3) 50%, transparent 70%)',
                opacity: 0.3 + volume * 0.7
              }}
            />
          )}
        </motion.div>

        {/* 3. Ultra-Realistic 3D Status Pill Badge & Enlarged End Call Button */}
        <div className="mt-2 flex items-center gap-2">
          <motion.div
            onClick={toggleCall}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`cursor-pointer px-3.5 py-1.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-wider uppercase ${
              callStatus === 'SPEAKING'
                ? 'bg-cyan-950/80 border-cyan-400/50 text-cyan-200 shadow-cyan-500/20'
                : callStatus === 'LISTENING'
                ? 'bg-blue-950/85 border-blue-400/50 text-blue-200 shadow-blue-500/25'
                : callStatus === 'CONNECTING'
                ? 'bg-amber-950/80 border-amber-400/50 text-amber-200 shadow-amber-500/20'
                : callStatus === 'DISCONNECTING'
                ? 'bg-red-950/80 border-red-400/50 text-red-200 shadow-red-500/20'
                : 'bg-black/60 border-white/15 text-white/85 hover:border-blue-400/50 hover:text-white shadow-black/50'
            }`}
          >
            {/* Status Icons and Indicators */}
            {callStatus === 'IDLE' && (
              <>
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] animate-pulse" />
                <span>Rose - Voice AI</span>
              </>
            )}

            {callStatus === 'CONNECTING' && (
              <>
                <span className="w-2 h-2 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <span>◌ CONNECTING...</span>
              </>
            )}

            {callStatus === 'LISTENING' && (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#3B82F6] animate-ping" />
                <span>◉ LISTENING</span>
                {/* 3-bar audio wave animation */}
                <div className="flex items-center gap-0.5 ml-0.5 h-3">
                  <span className="w-0.5 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </>
            )}

            {callStatus === 'SPEAKING' && (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>◉ SPEAKING</span>
                {/* 4-bar dynamic audio equalizer */}
                <div className="flex items-center gap-0.5 ml-0.5 h-3">
                  <span className="w-0.5 bg-cyan-300 rounded-full animate-pulse" style={{ height: `${Math.max(4, volume * 14)}px` }} />
                  <span className="w-0.5 bg-cyan-300 rounded-full animate-pulse" style={{ height: `${Math.max(6, volume * 18)}px`, animationDelay: '100ms' }} />
                  <span className="w-0.5 bg-cyan-300 rounded-full animate-pulse" style={{ height: `${Math.max(5, volume * 16)}px`, animationDelay: '200ms' }} />
                  <span className="w-0.5 bg-cyan-300 rounded-full animate-pulse" style={{ height: `${Math.max(3, volume * 12)}px`, animationDelay: '300ms' }} />
                </div>
              </>
            )}

            {callStatus === 'DISCONNECTING' && (
              <>
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span>◌ DISCONNECTING...</span>
              </>
            )}
          </motion.div>

          {/* Active Call Controls with Significantly Enlarged End Call Button */}
          {isActiveCall && (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className={`p-2 sm:p-2.5 rounded-full backdrop-blur-xl border transition-all duration-200 shadow-md cursor-pointer ${
                  isMuted 
                    ? 'bg-amber-950/85 border-amber-400/60 text-amber-300 shadow-amber-500/20' 
                    : 'bg-black/70 border-white/25 text-white/85 hover:text-white hover:border-white/45'
                }`}
                title={isMuted ? "Unmute microphone" : "Mute microphone"}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCall();
                }}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white border border-red-400/60 shadow-[0_0_18px_rgba(239,68,68,0.7)] transition-all duration-200 flex items-center gap-1.5 font-sans font-bold text-xs tracking-wider uppercase cursor-pointer"
                title="End voice conversation"
              >
                <PhoneOff className="w-4 h-4 text-white" />
                <span>End</span>
              </button>
            </div>
          )}
        </div>

        {/* Subtle subtext prompt when idle */}
        {callStatus === 'IDLE' && (
          <span className="mt-1 text-[10px] text-white/50 tracking-wider font-sans uppercase">
            Click orb to talk
          </span>
        )}

      </div>
    </div>
  );
};
