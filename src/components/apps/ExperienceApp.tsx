import React from 'react';

export const ExperienceApp = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="absolute inset-0 h-full w-full object-cover lg:scale-[1.2]"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260725_114042_d2ed2a89-f2fa-449b-9609-da456344257b.mp4"
      />

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex h-full flex-col px-5 sm:px-6 md:px-10 lg:px-14 pt-4 md:pt-6 lg:pt-8">
        
        {/* 1. FOUR-COLUMN META GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          
          {/* COL 1 */}
          <div>
            <h2 className="text-base md:text-lg tracking-wide leading-tight">
              <div className="font-normal">Dhruv</div>
              <div className="font-pixel text-xl md:text-2xl">Talnewar</div>
            </h2>
            <div className="text-[10px] text-white/50 mt-2">*</div>
            <div className="font-pixel mt-1 text-[10px] sm:text-xs text-white/60 leading-relaxed max-w-[280px]">
              AI Architect & Engineer specializing in production-grade multi-agent LLM pipelines and autonomous agentic workflows. | Building AI Infra and Enterprise-Grade AI Innovations from Scratch.
            </div>
          </div>

          {/* COL 2 */}
          <div>
            <h2 className="text-base md:text-lg tracking-wide leading-tight">
              <div className="font-normal">Agentic AI Systems &</div>
              <div className="font-pixel text-xl md:text-lg xl:text-xl">Multi-Agent Orchestration.</div>
            </h2>
          </div>

          {/* COL 3 */}
          <div className="hidden lg:block"></div>

          {/* COL 4 (Top Right) */}
          <div>
            <div className="text-sm tracking-widest text-white/50 uppercase mb-2 font-pixel">
              WHAT I DO
            </div>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-sm">
              AI Engineer specializing in Agentic AI Systems, LLM Applications, and Production-Grade GenAI Solutions. Experienced in building autonomous AI agents, RAG pipelines, prompt engineering workflows, LLM/Agent evaluations, and multi-agent orchestration using LangChain, LangGraph, Python, and vector databases. Skilled in integrating agentic capabilities into enterprise applications through autonomous workflows, intelligent tool use, and scalable AI architectures.
            </p>
          </div>
        </div>

        {/* 2. FLEX SPACER */}
        <div className="flex-1" />

        {/* 3. BOTTOM SECTION */}
        <div className="pb-3 lg:pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-end">
            
            {/* Hero Headline */}
            <h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-wide uppercase font-normal"
              style={{ lineHeight: 0.72 }}
            >
              I ENGINEER AI<br/>
              <span className="font-pixel font-normal text-[1.25em] inline-block leading-none align-baseline">INTELLIGENCE</span><br/>
              THAT THINKS, ACTS &<br/>
              <span className="font-pixel font-normal text-[1.25em] inline-block leading-none align-baseline">EVOLVES</span>
            </h1>

            {/* SERVICES SECTION */}
            <div className="flex flex-col lg:items-end lg:text-right pb-1">
              <div className="text-sm tracking-widest text-white/50 uppercase mb-2 font-pixel">
                SERVICES
              </div>
              <ul className="text-xs md:text-sm text-white/90 leading-relaxed space-y-0.5">
                <li>AI Engineer</li>
                <li>AgenticAI Architect</li>
                <li>Forward Deployed Engineer</li>
                <li>Voice AI Infra</li>
                <li>AI Agents</li>
                <li>MultiModal AI System</li>
                <li>3D Web Development</li>
                <li>UI/UX Design</li>
              </ul>
            </div>
          </div>

          {/* ROW B - Footer */}
          <div className="mt-3 sm:mt-4 pt-3 border-t border-white/10 lg:border-transparent">
            <div className="text-xs sm:text-sm text-white/80">
              Open to freelance, contract or full-time.{" "}
              <a 
                href="https://wa.me/919860486657" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                Schedule a call
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
