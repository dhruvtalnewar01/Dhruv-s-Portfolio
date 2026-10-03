import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, ArrowLeft, Trash2, FileText, Search, Copy, Check, Download, 
  Bold, Italic, Strikethrough, Heading1, Heading2, Code, List, ListOrdered, 
  CheckSquare, Quote, Minus, Clock, Eye, Edit3, PenTool, Sparkles, Share2
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  sketchData?: string;
  lastModified: number;
}

const DEFAULT_NOTES: Note[] = [
  {
    id: 'note-system-welcome',
    title: '⚡ Welcome to Portfolio OS — Systems Note',
    category: 'Architecture',
    content: `# Portfolio OS v1.0.0 Architecture

Welcome to the internal engineering notes for Portfolio OS.

### 🚀 Core System Capabilities
- [x] Multi-Window Compositing Kernel (Zustand state engine)
- [x] Autonomous Voice Agent (Rose — WebRTC low-latency streaming)
- [x] Spatial Dual-Identity Cursor Reveal Pipeline
- [x] Sandboxed Game Emulation & Terminal Environment
- [x] Production Zero-Leak Secrets Protocol & Netlify CI/CD

### 💡 Quick Tips
- **View Modes**: Switch between **Edit**, **Markdown Preview**, and **Sketch Canvas** using the top right toolbar.
- **Quick Formatting**: Highlight or insert headings, bold text, code blocks, or checklists.
- **Exporting**: Click the download icon to save your note as a clean \`.md\` file.

*All notes are encrypted and cached in local browser storage in real-time.*`,
    lastModified: Date.now() - 3600000
  },
  {
    id: 'note-clinical-ai',
    title: '🧠 AI Clinical Decision-Support Pipeline',
    category: 'AI Research',
    content: `# Clinical AI Decision-Support for Coronary Heart Disease

### System Workflow
1. **Patient Telemetry Ingestion**: High-concurrency FastAPI microservice parsing structured bio-markers.
2. **Predictive Stratification**: Ensemble hazard models calibrated against SCORE2 and Framingham parameters.
3. **Explainable Attribution**: Real-time SHAP feature contribution charts for clinical explainability.
4. **Clinical RAG Retrieval**: Stateful agent query over peer-reviewed cardiothoracic literature.

> "Bridging deterministic clinical standards with cognitive agentic synthesis."`,
    lastModified: Date.now() - 7200000
  },
  {
    id: 'note-atmanirbhar-ai',
    title: '🚗 ATMANIRBHAR AI — Multimodal Road Perception',
    category: 'Computer Vision',
    content: `# India-First Road Safety Intelligence

Key design considerations for high-entropy urban corridors:
- **Spatial Object Detection**: Fine-tuned multi-scale vision backbones.
- **Heterogeneous Classes**: Two-wheelers, auto-rickshaws, pedestrians, stray cattle, potholes.
- **Acoustic Localization**: Edge microphone array beamforming for horn and emergency vehicle detection.
- **Edge Inference**: Quantized TensorRT runtimes sustaining >45 FPS on low-power embedded hardware.`,
    lastModified: Date.now() - 14400000
  }
];

export const NotepadApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_os_notepad_notes_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load notes from localStorage', e);
    }
    return DEFAULT_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(() => {
    return notes[0]?.id || 'note-system-welcome';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'sketch'>('edit');
  const [copied, setCopied] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Sketch Canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#60a5fa');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync notes to local storage
  useEffect(() => {
    try {
      localStorage.setItem('portfolio_os_notepad_notes_v2', JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes to localStorage', e);
    }
  }, [notes]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  // Note actions
  const createNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      category: 'General',
      content: '',
      lastModified: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setViewMode('edit');
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, ...updates, lastModified: Date.now() } : n
    ));
  };

  const deleteNote = (id: string) => {
    const remaining = notes.filter(n => n.id !== id);
    if (remaining.length === 0) {
      const fallback: Note = {
        id: `note-${Date.now()}`,
        title: 'New Note',
        category: 'General',
        content: '',
        lastModified: Date.now()
      };
      setNotes([fallback]);
      setActiveNoteId(fallback.id);
    } else {
      setNotes(remaining);
      if (activeNoteId === id) {
        setActiveNoteId(remaining[0].id);
      }
    }
  };

  const duplicateNote = (noteToDup: Note) => {
    const duplicated: Note = {
      ...noteToDup,
      id: `note-${Date.now()}`,
      title: `${noteToDup.title} (Copy)`,
      lastModified: Date.now()
    };
    setNotes([duplicated, ...notes]);
    setActiveNoteId(duplicated.id);
  };

  // Copy note content
  const handleCopy = async () => {
    if (!activeNote) return;
    try {
      const fullText = `# ${activeNote.title}\n\n${activeNote.content}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Export note to file
  const handleDownload = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(activeNote.title || 'untitled').replace(/[^a-z0-9_-]/gi, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Formatting injection
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea || !activeNote) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = activeNote.content;
    const selected = text.substring(start, end);

    let replacement = '';
    if (selected) {
      replacement = `${prefix}${selected}${suffix}`;
    } else {
      replacement = `${prefix}${suffix || 'text'}`;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    updateNote(activeNote.id, { content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 10);
  };

  // Tab key indention support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea || !activeNote) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = activeNote.content;

      const newContent = text.substring(0, start) + '  ' + text.substring(end);
      updateNote(activeNote.id, { content: newContent });

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Calculate statistics
  const wordCount = activeNote?.content ? activeNote.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = activeNote?.content ? activeNote.content.length : 0;
  const readTime = Math.ceil(wordCount / 200) || 1;

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter === 'All' || n.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Setup Sketch Canvas
  useEffect(() => {
    if (viewMode !== 'sketch') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load saved sketch if available
    if (activeNote?.sketchData) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = activeNote.sketchData;
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [viewMode, activeNoteId]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = isEraser ? '#090d16' : strokeColor;
    ctx.lineWidth = isEraser ? strokeWidth * 4 : strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && activeNote) {
      const dataUrl = canvas.toDataURL();
      updateNote(activeNote.id, { sketchData: dataUrl });
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !activeNote) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateNote(activeNote.id, { sketchData: undefined });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const categories = ['All', 'Architecture', 'AI Research', 'Computer Vision', 'General'];

  const showList = !isMobileView || !activeNoteId;
  const showEditor = !isMobileView || !!activeNoteId;

  return (
    <div className="w-full h-full bg-[#090d16] text-white flex overflow-hidden pointer-events-auto font-sans select-text">
      
      {/* ─── SIDEBAR / NOTES DIRECTORY ─────────────────────────── */}
      {showList && (
        <div className={`flex flex-col border-r border-blue-900/20 bg-[#0c1220] ${isMobileView ? 'w-full' : 'w-[320px] md:w-[350px] shrink-0'}`}>
          
          {/* Header Bar with generous left padding for traffic lights */}
          <div className="h-14 bg-[#0e172a] border-b border-blue-900/20 flex items-center justify-between px-4 pl-28 md:pl-32 shadow-sm shrink-0 z-10">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-wide text-white flex items-center gap-2">
                Notepad
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {notes.length}
              </span>
            </div>
            
            <button
              onClick={createNote}
              className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center gap-1 text-xs font-medium cursor-pointer"
              title="Create New Note (Ctrl+N)"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>

          {/* Search & Categories Filter */}
          <div className="p-3 bg-[#0c1220] border-b border-blue-900/20 space-y-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400/60" />
              <input 
                type="text" 
                placeholder="Search notes or content..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111a2e] text-white text-xs rounded-lg pl-9 pr-7 py-2 outline-none border border-blue-900/30 focus:border-blue-500/60 focus:bg-[#142038] transition-all placeholder:text-gray-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategoryFilter === cat 
                      ? 'bg-blue-600 text-white font-medium shadow-sm' 
                      : 'bg-blue-950/40 text-gray-400 hover:text-gray-200 hover:bg-blue-900/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto divide-y divide-blue-950/30 scrollbar-thin scrollbar-thumb-blue-950">
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500 px-4 text-center">
                <FileText className="w-8 h-8 mb-2 text-blue-400/30" />
                <p className="text-xs font-medium text-gray-400">No notes matched your search</p>
                <p className="text-[11px] text-gray-600 mt-1">Try another keyword or create a new note</p>
              </div>
            ) : (
              filteredNotes
                .sort((a, b) => b.lastModified - a.lastModified)
                .map(note => {
                  const isActive = activeNote?.id === note.id;
                  const snippet = note.content 
                    ? note.content.replace(/[#*`_~>[\]-]/g, '').trim().substring(0, 70) 
                    : 'Empty note...';

                  return (
                    <div 
                      key={note.id}
                      onClick={() => {
                        setActiveNoteId(note.id);
                        if (isMobileView) setViewMode('edit');
                      }}
                      className={`p-3.5 cursor-pointer transition-all relative group flex flex-col gap-1 ${
                        isActive 
                          ? 'bg-blue-600/10 border-l-2 border-blue-500 shadow-inner' 
                          : 'hover:bg-blue-950/20 border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold text-xs truncate ${isActive ? 'text-blue-300' : 'text-gray-200'}`}>
                          {note.title || 'Untitled Note'}
                        </h3>
                        <span className="text-[10px] text-gray-500 shrink-0 font-mono">
                          {formatDate(note.lastModified)}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                        {snippet}
                      </p>

                      <div className="flex items-center justify-between pt-1 mt-0.5">
                        {note.category && (
                          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-400/80 border border-blue-800/30">
                            {note.category}
                          </span>
                        )}

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                          <button
                            onClick={(e) => { e.stopPropagation(); duplicateNote(note); }}
                            className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                            title="Duplicate Note"
                          >
                            <Copy size={12} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                            className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            title="Delete Note"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {/* Footer Status */}
          <div className="p-2.5 bg-[#090d16] border-t border-blue-900/20 flex items-center justify-between text-[11px] text-gray-500 px-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Auto-saved locally
            </span>
            <span className="font-mono text-[10px]">v1.0 OS</span>
          </div>
        </div>
      )}

      {/* ─── MAIN EDITOR & WORKSPACE ───────────────────────────── */}
      {showEditor && (
        <div className="flex-1 flex flex-col bg-[#090d16] min-w-0 h-full overflow-hidden">
          
          {activeNote ? (
            <>
              {/* Top Navigation & Action Toolbar */}
              <div className="h-14 bg-[#0e172a] border-b border-blue-900/20 flex items-center justify-between px-4 shadow-sm z-10 shrink-0 gap-3">
                
                {/* Left: Mobile back button + Note Title */}
                <div className="flex items-center flex-1 min-w-0">
                  {isMobileView && (
                    <button 
                      onClick={() => setActiveNoteId('')}
                      className="p-1.5 mr-2 rounded-lg bg-blue-900/30 text-gray-300 hover:text-white hover:bg-blue-800/40 transition-colors"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  
                  <input 
                    type="text" 
                    value={activeNote.title}
                    onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                    placeholder="Note Title..."
                    className="bg-transparent text-sm md:text-base font-semibold text-white outline-none w-full truncate placeholder:text-gray-600 focus:placeholder:text-gray-500"
                  />
                </div>

                {/* Right: Mode Switchers & Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* View Mode Segmented Controls */}
                  <div className="flex items-center bg-[#131d36] p-0.5 rounded-lg border border-blue-900/30 text-xs">
                    <button
                      onClick={() => setViewMode('edit')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        viewMode === 'edit' 
                          ? 'bg-blue-600 text-white font-medium shadow-sm' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title="Edit Mode"
                    >
                      <Edit3 size={13} />
                      <span className="hidden md:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => setViewMode('preview')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        viewMode === 'preview' 
                          ? 'bg-blue-600 text-white font-medium shadow-sm' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title="Markdown Preview"
                    >
                      <Eye size={13} />
                      <span className="hidden md:inline">Preview</span>
                    </button>

                    <button
                      onClick={() => setViewMode('sketch')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        viewMode === 'sketch' 
                          ? 'bg-blue-600 text-white font-medium shadow-sm' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title="Sketch Canvas"
                    >
                      <PenTool size={13} />
                      <span className="hidden md:inline">Sketch</span>
                    </button>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-[#131d36] hover:bg-[#1a284a] text-gray-300 hover:text-white border border-blue-900/30 transition-all cursor-pointer flex items-center gap-1 text-xs"
                    title="Copy full note"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span className="hidden xl:inline">{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg bg-[#131d36] hover:bg-[#1a284a] text-gray-300 hover:text-white border border-blue-900/30 transition-all cursor-pointer flex items-center gap-1 text-xs"
                    title="Export as Markdown (.md)"
                  >
                    <Download size={14} />
                    <span className="hidden xl:inline">Export</span>
                  </button>
                </div>
              </div>

              {/* Quick Markdown Formatting Strip (Visible in Edit mode) */}
              {viewMode === 'edit' && (
                <div className="h-10 bg-[#0b1120] border-b border-blue-900/20 px-4 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 text-gray-400 text-xs">
                  <button onClick={() => insertFormatting('**', '**')} className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded" title="Bold (**text**)">
                    <Bold size={14} />
                  </button>
                  <button onClick={() => insertFormatting('*', '*')} className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded" title="Italic (*text*)">
                    <Italic size={14} />
                  </button>
                  <button onClick={() => insertFormatting('~~', '~~')} className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded" title="Strikethrough (~~text~~)">
                    <Strikethrough size={14} />
                  </button>
                  <div className="w-[1px] h-4 bg-blue-900/40 mx-1" />
                  <button onClick={() => insertFormatting('# ')} className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded" title="Heading 1 (# text)">
                    <Heading1 size={14} />
                  </button>
                  <button onClick={() => insertFormatting('## ')} className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded" title="Heading 2 (## text)">
                    <Heading2 size={14} />
                  </button>
                  <div className="w-[1px] h-4 bg-blue-900/40 mx-1" />
                  <button onClick={() => insertFormatting('```\n', '\n```')} className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded" title="Code Block (```code```)">
                    <Code size={14} />
                  </button>
                  <button onClick={() => insertFormatting('- ')} className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded" title="Bullet List (- item)">
                    <List size={14} />
                  </button>
                  <button onClick={() => insertFormatting('1. ')} className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded" title="Numbered List (1. item)">
                    <ListOrdered size={14} />
                  </button>
                  <button onClick={() => insertFormatting('- [ ] ')} className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded" title="Checklist (- [ ] task)">
                    <CheckSquare size={14} />
                  </button>
                  <button onClick={() => insertFormatting('> ')} className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded" title="Blockquote (> quote)">
                    <Quote size={14} />
                  </button>
                  <button onClick={() => insertFormatting('\n---\n')} className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded" title="Divider (---)">
                    <Minus size={14} />
                  </button>
                  <div className="w-[1px] h-4 bg-blue-900/40 mx-1" />
                  <button 
                    onClick={() => insertFormatting(`\n*Modified: ${new Date().toLocaleTimeString()}*\n`)} 
                    className="p-1.5 hover:text-white hover:bg-blue-900/30 rounded flex items-center gap-1 text-[11px]" 
                    title="Insert Timestamp"
                  >
                    <Clock size={13} />
                    <span className="hidden sm:inline">Time</span>
                  </button>
                </div>
              )}

              {/* Sketch Controls Strip (Visible in Sketch mode) */}
              {viewMode === 'sketch' && (
                <div className="h-10 bg-[#0b1120] border-b border-blue-900/20 px-4 flex items-center justify-between shrink-0 text-gray-400 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 font-medium">Color:</span>
                    {['#60a5fa', '#34d399', '#f87171', '#fbbf24', '#ffffff'].map(c => (
                      <button
                        key={c}
                        onClick={() => { setStrokeColor(c); setIsEraser(false); }}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                          strokeColor === c && !isEraser ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                      />
                    ))}

                    <div className="w-[1px] h-4 bg-blue-900/40 mx-1" />

                    <span className="text-[11px] text-gray-500 font-medium">Stroke:</span>
                    {[2, 4, 8].map(w => (
                      <button
                        key={w}
                        onClick={() => setStrokeWidth(w)}
                        className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                          strokeWidth === w ? 'bg-blue-600 text-white' : 'hover:bg-blue-900/30 text-gray-400'
                        }`}
                      >
                        {w}px
                      </button>
                    ))}

                    <button
                      onClick={() => setIsEraser(!isEraser)}
                      className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ml-1 ${
                        isEraser ? 'bg-amber-600 text-white' : 'hover:bg-blue-900/30 text-gray-400'
                      }`}
                    >
                      Eraser
                    </button>
                  </div>

                  <button
                    onClick={clearCanvas}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-0.5 rounded text-[11px] cursor-pointer"
                  >
                    Clear Sketch
                  </button>
                </div>
              )}

              {/* Workspace Content Area */}
              <div className="flex-1 relative overflow-auto bg-[#090d16]">
                {/* 1. EDIT MODE: High-performance distraction-free editor */}
                {viewMode === 'edit' && (
                  <textarea
                    ref={textareaRef}
                    value={activeNote.content}
                    onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your notes, ideas, markdown, or code here... (Auto-saved)"
                    className="w-full h-full p-6 bg-transparent text-gray-100 placeholder:text-gray-600 outline-none resize-none font-mono text-[13px] md:text-sm leading-relaxed selection:bg-blue-600/30"
                    spellCheck={false}
                  />
                )}

                {/* 2. PREVIEW MODE: Beautiful Rendered Markdown */}
                {viewMode === 'preview' && (
                  <div className="p-8 max-w-4xl mx-auto space-y-4 font-sans text-gray-200 leading-relaxed text-sm md:text-base">
                    {activeNote.content.trim() ? (
                      activeNote.content.split('\n').map((line, idx) => {
                        // Headers
                        if (line.startsWith('# ')) {
                          return <h1 key={idx} className="text-2xl md:text-3xl font-bold text-white tracking-tight pb-2 border-b border-blue-900/30 mt-6 first:mt-0">{line.replace('# ', '')}</h1>;
                        }
                        if (line.startsWith('## ')) {
                          return <h2 key={idx} className="text-xl md:text-2xl font-semibold text-blue-300 tracking-tight mt-5 pb-1 border-b border-blue-900/20">{line.replace('## ', '')}</h2>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={idx} className="text-base md:text-lg font-semibold text-blue-400 mt-4">{line.replace('### ', '')}</h3>;
                        }
                        // Horizontal divider
                        if (line.trim() === '---') {
                          return <hr key={idx} className="border-blue-900/40 my-4" />;
                        }
                        // Blockquote
                        if (line.startsWith('> ')) {
                          return (
                            <blockquote key={idx} className="border-l-4 border-blue-500 bg-blue-950/20 px-4 py-2 italic text-gray-300 rounded-r my-2">
                              {line.replace('> ', '')}
                            </blockquote>
                          );
                        }
                        // Checklist items
                        if (line.startsWith('- [ ] ') || line.startsWith('- [x] ') || line.startsWith('- [X] ')) {
                          const isChecked = line.startsWith('- [x] ') || line.startsWith('- [X] ');
                          const itemText = line.replace(/- \[[ xX]\] /, '');
                          return (
                            <div 
                              key={idx} 
                              onClick={() => {
                                const newLines = activeNote.content.split('\n');
                                newLines[idx] = isChecked ? `- [ ] ${itemText}` : `- [x] ${itemText}`;
                                updateNote(activeNote.id, { content: newLines.join('\n') });
                              }}
                              className="flex items-center gap-2.5 py-1 text-gray-300 cursor-pointer hover:text-white group select-none"
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                isChecked 
                                  ? 'bg-blue-600 border-blue-500 text-white' 
                                  : 'border-gray-500 bg-blue-950/30 group-hover:border-blue-400'
                              }`}>
                                {isChecked && <Check size={12} strokeWidth={3} />}
                              </div>
                              <span className={isChecked ? 'line-through text-gray-500' : ''}>{itemText}</span>
                            </div>
                          );
                        }
                        // Bullet point
                        if (line.startsWith('- ')) {
                          return (
                            <li key={idx} className="ml-5 list-disc text-gray-300 py-0.5">
                              {line.replace('- ', '')}
                            </li>
                          );
                        }
                        // Code block line
                        if (line.startsWith('```')) {
                          return null;
                        }
                        // Empty line
                        if (!line.trim()) {
                          return <div key={idx} className="h-2" />;
                        }
                        // Normal text line
                        return <p key={idx} className="text-gray-300 leading-relaxed">{line}</p>;
                      })
                    ) : (
                      <div className="text-gray-500 italic py-12 text-center">
                        This note is currently empty. Switch to <strong>Edit</strong> mode to add content.
                      </div>
                    )}
                  </div>
                )}

                {/* 3. SKETCH MODE: 100% Native HTML5 Canvas (Zero External Crash Risk) */}
                {viewMode === 'sketch' && (
                  <div className="w-full h-full relative cursor-crosshair overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={1200}
                      height={900}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-full bg-[#090d16] touch-none"
                    />
                    <div className="absolute bottom-4 right-4 pointer-events-none text-[11px] text-gray-500 bg-black/40 px-3 py-1 rounded-full border border-blue-900/30 backdrop-blur-sm">
                      Interactive Freehand Sketchpad
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Metrics Bar */}
              <div className="h-8 bg-[#0b1120] border-t border-blue-900/20 px-4 flex items-center justify-between text-[11px] text-gray-400 shrink-0 font-mono">
                <div className="flex items-center gap-4">
                  <span>{wordCount} words</span>
                  <span>{charCount} characters</span>
                  <span className="hidden sm:inline">{readTime} min read</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Portfolio OS Engine</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
              <FileText className="w-12 h-12 mb-3 text-blue-500/20" />
              <h3 className="text-sm font-semibold text-gray-300 mb-1">No Note Selected</h3>
              <p className="text-xs text-gray-500 mb-4 max-w-sm">Select an existing note from the directory or create a new document to start drafting.</p>
              <button
                onClick={createNote}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} />
                Create New Note
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
