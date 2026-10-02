import React from 'react';
import { ownerProfile } from '../../ownerProfile';

export const ResultsApp = () => (
  <div className="p-8 text-center flex flex-col items-center justify-center h-full">
    <h2 className="text-3xl font-bold mb-4">Evidence Vault</h2>
    <p className="opacity-70 max-w-md">Real analytics, verified metrics, and quantifiable outcomes from past deployments.</p>
  </div>
);

export const SystemsApp = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4 border-b pb-2">How the work ships</h2>
    <ul className="list-disc pl-5 space-y-2 opacity-80 mt-4">
      <li>Agentic Workflows</li>
      <li>Multi-Modal RAG pipelines</li>
      <li>Autonomous AI Infrastructure</li>
      <li>Production-grade deployment</li>
    </ul>
  </div>
);

export const ProofApp = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Client Videos</h2>
    <div className="grid grid-cols-2 gap-4 mt-8">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-black/10 dark:bg-white/10 aspect-video rounded flex items-center justify-center">
          Video {i} Placeholder
        </div>
      ))}
    </div>
  </div>
);

export const JourneyApp = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">2023 -&gt; Now</h2>
    <div className="border-l-2 border-blue-500 pl-4 space-y-6">
      <div>
        <div className="font-bold">Present</div>
        <div className="opacity-70 text-sm">Building Production-Grade AI</div>
      </div>
      <div>
        <div className="font-bold">2023</div>
        <div className="opacity-70 text-sm">Started AI Architect Journey</div>
      </div>
    </div>
  </div>
);

export const AIVoiceAgentApp = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <div className="w-24 h-24 rounded-full bg-blue-500/20 border-4 border-blue-500 flex items-center justify-center mb-6 animate-pulse">
      🎤
    </div>
    <h2 className="text-2xl font-bold">Voice Agent Online</h2>
    <p className="opacity-70 mt-2">"Hello, how can I help you today?"</p>
  </div>
);

export const PlayGamesApp = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Arcade</h2>
    <p>Viper Arena & Fangs.io coming soon.</p>
  </div>
);

export const WhiteboardApp = () => (
  <div className="p-8 h-full bg-[#fdfbf7] dark:bg-[#111111] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]">
    <h2 className="text-xl font-bold font-mono">Scratchpad...</h2>
  </div>
);

export const BrowserApp = () => (
  <div className="flex flex-col h-full bg-white dark:bg-black rounded-lg overflow-hidden border">
    <div className="h-10 border-b flex items-center px-4 gap-4 bg-gray-100 dark:bg-gray-900">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="flex-1 bg-white dark:bg-black border rounded px-3 py-1 text-xs font-mono text-center">
        https://os.net
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center opacity-50">
      Welcome to OS Net
    </div>
  </div>
);

export const CaseFilesApp = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4 border-b pb-2">Client Stories</h2>
    <p className="opacity-70">Confidential folders.</p>
  </div>
);

export const AIFieldNotesApp = () => (
  <div className="p-8 font-serif">
    <h1 className="text-3xl font-bold mb-4">AI Field Notes</h1>
    <p className="leading-relaxed opacity-80">
      Observations on agentic workflows, multi-modal systems, and the future of autonomous architecture.
    </p>
  </div>
);

export const LearnApp = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-red-500 mb-4">YouTube Uploads</h2>
    <p className="opacity-70">Watch tutorials and technical breakdowns.</p>
  </div>
);

export const EmergencyApp = () => (
  <div className="p-8 bg-red-500/10 h-full flex flex-col items-center justify-center text-center border-4 border-red-500">
    <h1 className="text-4xl font-black text-red-500 mb-4 uppercase tracking-widest">Emergency Contact</h1>
    <p className="text-xl font-bold mb-8">Initiate Direct Protocol</p>
    <a href={ownerProfile.conversion.whatsappUrl} className="bg-red-500 text-white font-bold text-xl px-8 py-4 rounded-full hover:bg-red-600 transition-colors">
      CALL +91 9860486657
    </a>
  </div>
);
