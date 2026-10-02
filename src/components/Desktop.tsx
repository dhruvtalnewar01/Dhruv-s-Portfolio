import { AppIcon } from './AppIcon';
import { WindowManager } from './WindowManager';
import { Dock } from './Dock';
import { TopUI } from './TopUI';
import { SpotlightHero } from './SpotlightHero';
import { RedirectToast } from './ui/RedirectToast';
import { VoiceAIAssistant } from './ui/VoiceAIAssistant';
import { 
  Folder, Briefcase, Trophy, FileText, Mic, 
  Mail, PenTool, Gamepad2, Play, Music
} from 'lucide-react';

export const Desktop = () => {
  const apps = [
    { id: 'projects', label: 'Projects', desc: 'Case files', icon: <Folder />, badge: 'Drive', bgImage: 'https://img.icons8.com/3d-fluency/512/folder-invoices.png' },
    { id: 'experience', label: 'Experience', desc: 'My resume', icon: <Briefcase />, bgImage: '/assets/analytics_3d_1786454935109.png' },
    { id: 'achievements', label: 'Achievements', desc: 'Awards', icon: <Trophy />, bgImage: 'https://img.icons8.com/3d-fluency/512/trophy.png' },
    { id: 'founder', label: 'Founder.txt', desc: 'Read note', icon: <FileText />, bgImage: 'https://img.icons8.com/3d-fluency/512/document.png' },
    { id: 'contact', label: 'Contact', desc: 'Message me', icon: <Mail />, bgImage: '/assets/mail_3d_1786454921675.png' },
    { id: 'services', label: 'Services', desc: 'What I do', icon: <Briefcase />, bgImage: 'https://img.icons8.com/3d-fluency/512/briefcase.png' },
    { id: 'voice-agents', label: 'Voice AI Infra', desc: 'Talk to AI', icon: <Mic />, bgImage: 'https://img.icons8.com/3d-fluency/512/microphone.png' },
    { id: 'notepad', label: 'Notepad', desc: 'Write notes', icon: <PenTool />, bgImage: '/assets/notes_3d.jpg' },
    { id: 'games', label: 'Games', desc: 'Arcade', icon: <Gamepad2 />, bgImage: 'https://img.icons8.com/3d-fluency/512/controller.png' },
    { id: 'gtav', label: 'GTA V', desc: 'Play now', icon: <Gamepad2 />, bgImage: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png' },
    { id: 'youtube', label: 'YouTube', desc: 'Watch videos', icon: <Play />, bgImage: 'https://img.icons8.com/3d-fluency/512/youtube-play.png' },
    { id: 'music', label: 'Music', desc: 'Spotify', icon: <Music />, bgImage: '/assets/music_3d.jpg' },
  ];

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black font-gwen">
      
      <SpotlightHero />

      <TopUI />

      {/* Freely Draggable Desktop Icons */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {apps.map((app, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;
          const initialX = 40 + col * 100;
          const initialY = 160 + row * 100;

          return (
            <AppIcon key={app.id} app={app} index={index} initialX={initialX} initialY={initialY} />
          );
        })}
      </div>

      <div className="z-20 absolute inset-0 w-full h-full pointer-events-none">
        <WindowManager />
      </div>
      
      <Dock />
      <VoiceAIAssistant />
      <RedirectToast />
    </div>
  );
};
