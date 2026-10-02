import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Trash2, FileText, Search } from 'lucide-react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export const NotepadApp = () => {
  // Local storage setup for persistence
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('farmerbb_notepad_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: '1',
        title: 'Welcome to Notepad',
        content: '',
        lastModified: Date.now()
      }
    ];
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    localStorage.setItem('farmerbb_notepad_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      lastModified: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, ...updates, lastModified: Date.now() } : n
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
    // Also clean up tldraw persistence key
    localStorage.removeItem(`notepad-${id}`);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showList = !isMobileView || !activeNoteId;
  const showEditor = !isMobileView || activeNoteId;

  return (
    <div className="w-full h-full bg-[#121212] text-white flex overflow-hidden pointer-events-auto font-sans">
      
      {/* List Pane */}
      {showList && (
        <div className={`flex flex-col border-r border-[#333] ${isMobileView ? 'w-full' : 'w-1/3 min-w-[300px] max-w-[400px]'}`}>
          {/* Top App Bar - added pl-20 to avoid traffic lights overlap */}
          <div className="h-14 bg-[#1f1f1f] flex items-center px-4 pl-20 shadow-md z-10 shrink-0">
            <h1 className="text-xl font-medium tracking-wide">Notepad</h1>
          </div>

          {/* Search Bar */}
          <div className="p-3 bg-[#121212] shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search notes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1f1f1f] text-white text-sm rounded-md pl-10 pr-4 py-2 outline-none border border-transparent focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto relative">
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileText className="w-12 h-12 mb-2 opacity-20" />
                <p>No notes found</p>
              </div>
            ) : (
              <div className="divide-y divide-[#2a2a2a]">
                {filteredNotes.sort((a, b) => b.lastModified - a.lastModified).map(note => (
                  <div 
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-4 cursor-pointer hover:bg-[#1a1a1a] transition-colors relative group flex justify-between items-start ${activeNoteId === note.id ? 'bg-[#1a1a1a] border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="overflow-hidden min-w-0 pr-2">
                      <h3 className="font-medium text-[15px] truncate mb-1 text-gray-100">{note.title || 'Untitled'}</h3>
                      <p className="text-[10px] text-gray-500">{formatDate(note.lastModified)}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all shrink-0"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* FAB */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createNote}
              className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-colors z-20"
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Editor Pane */}
      {showEditor && (
        <div className="flex-1 flex flex-col bg-[#121212]">
          {activeNote ? (
            <>
              {/* Editor App Bar */}
              <div className="h-14 bg-[#1f1f1f] flex items-center px-2 shadow-md z-10 shrink-0 justify-between">
                <div className="flex items-center flex-1 min-w-0">
                  {isMobileView && (
                    <button onClick={() => setActiveNoteId(null)} className="p-2 mr-2 hover:bg-white/10 rounded-full transition-colors">
                      <ArrowLeft className="w-5 h-5 text-gray-300" />
                    </button>
                  )}
                  <input 
                    type="text" 
                    value={activeNote.title}
                    onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                    placeholder="Note Title"
                    className="bg-transparent text-lg font-medium text-white outline-none w-full truncate placeholder-gray-500 ml-2"
                  />
                </div>
              </div>

              {/* Editor Body - Upgraded with Tldraw */}
              <div className="flex-1 relative z-0">
                <Tldraw persistenceKey={`notepad-${activeNote.id}`} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <FileText className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-lg">Select a note or create a new one</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
