import { useStore } from '../store/useStore';
import { Window } from './Window';

import { ProjectsApp } from './apps/ProjectsApp';
import { FounderApp } from './apps/FounderApp';
import { SocialsApp } from './apps/SocialsApp';
import { ExperienceApp } from './apps/ExperienceApp';
import { AchievementsApp } from './apps/AchievementsApp';
import { 
  ResultsApp, SystemsApp, ProofApp, JourneyApp, 
  WhiteboardApp, BrowserApp, 
  CaseFilesApp, AIFieldNotesApp, LearnApp, EmergencyApp 
} from './apps/ExtraApps';
import { ContactApp } from './apps/ContactApp';
import { ServicesApp } from './apps/ServicesApp';
import { NotepadApp } from './apps/NotepadApp';
import { VoiceAIApp } from './apps/VoiceAIApp';
import { GamesApp } from './apps/GamesApp';
import { GtaVApp } from './apps/GtaVApp';

export const WindowManager = () => {
  const { windows } = useStore();

  const renderAppContent = (id: string) => {
    switch(id) {
      case 'achievements': return <AchievementsApp />;
      case 'experience': return <ExperienceApp />;
      case 'projects': return <ProjectsApp />;
      case 'results': return <ResultsApp />;
      case 'systems': return <SystemsApp />;
      case 'proof': return <ProofApp />;
      case 'journey': return <JourneyApp />;
      case 'socials': return <SocialsApp />;
      case 'voice-agents':
      case 'ai-voice-agent': return <VoiceAIApp />;
      case 'games':
      case 'play-games': return <GamesApp />;
      case 'gtav': return <GtaVApp />;
      case 'founder': return <FounderApp />;
      case 'whiteboard': return <WhiteboardApp />;
      case 'browser': return <BrowserApp />;
      case 'contact': return <ContactApp />;
      case 'services': return <ServicesApp />;
      case 'notepad': return <NotepadApp />;
      case 'case-files': return <CaseFilesApp />;
      case 'ai-field-notes': return <AIFieldNotesApp />;
      case 'learn': return <LearnApp />;
      case 'emergency': return <EmergencyApp />;
      case 'youtube':
        return (
          <div className="p-10 flex flex-col items-center justify-center text-center h-full">
            <h2 className="text-2xl font-bold mb-3 text-red-500">YouTube</h2>
            <p className="text-white/70 mb-6">Launching YouTube videos and technical breakdowns...</p>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors shadow-lg">Open YouTube</a>
          </div>
        );
      case 'music':
        return (
          <div className="p-10 flex flex-col items-center justify-center text-center h-full">
            <h2 className="text-2xl font-bold mb-3 text-emerald-400">Spotify</h2>
            <p className="text-white/70 mb-6">Launching Spotify Web Player...</p>
            <a href="https://open.spotify.com" target="_blank" rel="noreferrer" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-full transition-colors shadow-lg">Open Spotify</a>
          </div>
        );
      default: return <div className="p-8 text-center opacity-50">Application not found.</div>;
    }
  };

  return (
    <>
      {windows.map(win => (
        win.isOpen && !win.isMinimized && (
          <Window key={win.id} id={win.id} title={win.title} zIndex={win.zIndex} isMaximized={win.isMaximized} isBorderless={win.id === 'experience' || win.id === 'achievements' || win.id === 'founder' || win.id === 'contact' || win.id === 'notepad' || win.id === 'voice-agents' || win.id === 'ai-voice-agent' || win.id === 'services' || win.id === 'games' || win.id === 'play-games'}>
            {renderAppContent(win.id)}
          </Window>
        )
      ))}
    </>
  );
};
