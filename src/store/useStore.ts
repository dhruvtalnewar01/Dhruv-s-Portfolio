import { create } from 'zustand';
import { launchExternalApp } from '../utils/launchExternal';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface OSState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (id: string, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

export const useStore = create<OSState>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  windows: [],
  activeWindowId: null,
  
  openWindow: (id, title) => {
    if (id === 'youtube') {
      launchExternalApp('https://www.youtube.com', 'YouTube', 'youtube');
      return;
    }
    if (id === 'music') {
      launchExternalApp('https://open.spotify.com', 'Spotify', 'spotify');
      return;
    }

    set((state) => {
      const existing = state.windows.find(w => w.id === id);
      const maxZ = state.windows.length > 0 ? Math.max(...state.windows.map(w => w.zIndex)) : 0;
      
      if (existing) {
        return {
          windows: state.windows.map(w => 
            w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w
          ),
          activeWindowId: id
        };
      }
      
      return {
        windows: [...state.windows, { 
          id, 
          title, 
          isOpen: true, 
          isMinimized: false, 
          isMaximized: id === 'projects' || id === 'experience' || id === 'achievements' || id === 'founder' || id === 'contact' || id === 'notepad' || id === 'voice-agents' || id === 'ai-voice-agent' || id === 'services' || id === 'games' || id === 'play-games',
          zIndex: maxZ + 1 
        }],
        activeWindowId: id
      };
    });
  },
  
  closeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isOpen: false } : w),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),
  
  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),
  
  maximizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
  })),
  
  focusWindow: (id) => set((state) => {
    if (state.activeWindowId === id) return state;
    const maxZ = state.windows.length > 0 ? Math.max(...state.windows.map(w => w.zIndex)) : 0;
    return {
      windows: state.windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w),
      activeWindowId: id
    };
  })
}));
