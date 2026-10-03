import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, Search, Replace, ChevronDown, Check, 
  FileText, FolderOpen, Save, Printer, HelpCircle, 
  ZoomIn, ZoomOut, RotateCcw, Clock, Type, Settings
} from 'lucide-react';

interface TabDocument {
  id: string;
  title: string;
  content: string;
  isModified: boolean;
}

const DEFAULT_WELCOME_TEXT = `Welcome to Notepad

This is a clean, realistic text editor built for Portfolio OS.
Type or paste your text here. Changes are saved automatically.`;

const STORAGE_KEY = 'portfolio_os_notepad_real_v3';

export const NotepadApp: React.FC = () => {
  // Tabs state
  const [tabs, setTabs] = useState<TabDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load tabs from storage', e);
    }
    return [
      {
        id: 'tab-default',
        title: 'Welcome to Notepad.txt',
        content: DEFAULT_WELCOME_TEXT,
        isModified: false
      }
    ];
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    return tabs[0]?.id || 'tab-default';
  });

  // Editor settings
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [fontFamily, setFontFamily] = useState<string>('Consolas, "Cascadia Code", "Courier New", monospace');
  const [fontSize, setFontSize] = useState<number>(14);
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [showStatusBar, setShowStatusBar] = useState<boolean>(true);

  // Cursor position metrics
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Menu bar state
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Find & Replace dialog state
  const [showFindBar, setShowFindBar] = useState<boolean>(false);
  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [matchCase, setMatchCase] = useState<boolean>(false);
  const [findMatchCount, setFindMatchCount] = useState<number>(0);

  // About modal state
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  // DOM Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Active tab reference
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Save tabs to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
    } catch (e) {
      console.error('Failed to save to storage', e);
    }
  }, [tabs]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update cursor position metrics on selection / click / keyup
  const updateCursorMetrics = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const pos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, pos);
    const lines = textBefore.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  // Tab management
  const createNewTab = (customTitle?: string, initialContent: string = '') => {
    const newId = `tab-${Date.now()}`;
    const title = customTitle || `Untitled ${tabs.length + 1}.txt`;
    const newTab: TabDocument = {
      id: newId,
      title,
      content: initialContent,
      isModified: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
    setOpenMenu(null);
  };

  const closeTab = (idToClose: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (tabs.length === 1) {
      // Keep at least one tab
      setTabs([{
        id: `tab-${Date.now()}`,
        title: 'Untitled 1.txt',
        content: '',
        isModified: false
      }]);
      return;
    }
    const filtered = tabs.filter(t => t.id !== idToClose);
    setTabs(filtered);
    if (activeTabId === idToClose) {
      setActiveTabId(filtered[filtered.length - 1].id);
    }
  };

  const updateActiveContent = (newContent: string) => {
    if (!activeTab) return;
    setTabs(prev => prev.map(t => 
      t.id === activeTab.id ? { ...t, content: newContent, isModified: true } : t
    ));
  };

  // Keyboard shortcut handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key indention
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = activeTab.content;
      const replacement = '    ';
      const updated = text.substring(0, start) + replacement + text.substring(end);
      updateActiveContent(updated);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        updateCursorMetrics();
      }, 0);
      return;
    }

    // Ctrl+S: Save file
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      handleSaveFile();
      return;
    }

    // Ctrl+N: New tab
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      createNewTab();
      return;
    }

    // Ctrl+O: Open file
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      fileInputRef.current?.click();
      return;
    }

    // Ctrl+F: Open Find
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      setShowFindBar(true);
      return;
    }

    // F5: Insert Time/Date
    if (e.key === 'F5') {
      e.preventDefault();
      insertDateTime();
      return;
    }
  };

  // File operations
  const handleSaveFile = () => {
    if (!activeTab) return;
    const blob = new Blob([activeTab.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeTab.title.endsWith('.txt') ? activeTab.title : `${activeTab.title}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setTabs(prev => prev.map(t => 
      t.id === activeTab.id ? { ...t, isModified: false } : t
    ));
    setOpenMenu(null);
  };

  const handleOpenFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      createNewTab(file.name, text || '');
    };
    reader.readAsText(file);
    e.target.value = '';
    setOpenMenu(null);
  };

  const handlePrint = () => {
    window.print();
    setOpenMenu(null);
  };

  // Edit operations
  const insertDateTime = () => {
    const textarea = textareaRef.current;
    if (!textarea || !activeTab) return;
    const now = new Date();
    const formatted = `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${now.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })}`;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = activeTab.content;
    const updated = text.substring(0, start) + formatted + text.substring(end);
    updateActiveContent(updated);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + formatted.length;
      textarea.focus();
      updateCursorMetrics();
    }, 0);
    setOpenMenu(null);
  };

  const handleSelectAll = () => {
    textareaRef.current?.select();
    setOpenMenu(null);
  };

  // Find & Replace
  useEffect(() => {
    if (!findText.trim() || !activeTab) {
      setFindMatchCount(0);
      return;
    }
    const content = matchCase ? activeTab.content : activeTab.content.toLowerCase();
    const query = matchCase ? findText : findText.toLowerCase();
    const matches = content.split(query).length - 1;
    setFindMatchCount(Math.max(0, matches));
  }, [findText, matchCase, activeTab?.content]);

  const handleFindNext = () => {
    const textarea = textareaRef.current;
    if (!textarea || !findText || !activeTab) return;
    const text = matchCase ? activeTab.content : activeTab.content.toLowerCase();
    const query = matchCase ? findText : findText.toLowerCase();
    const startPos = textarea.selectionEnd;

    let matchIndex = text.indexOf(query, startPos);
    if (matchIndex === -1) {
      // Loop back to beginning
      matchIndex = text.indexOf(query, 0);
    }

    if (matchIndex !== -1) {
      textarea.focus();
      textarea.setSelectionRange(matchIndex, matchIndex + findText.length);
      updateCursorMetrics();
    }
  };

  const handleReplace = () => {
    const textarea = textareaRef.current;
    if (!textarea || !findText || !activeTab) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = activeTab.content.substring(start, end);

    const matches = matchCase 
      ? selected === findText 
      : selected.toLowerCase() === findText.toLowerCase();

    if (matches) {
      const updated = activeTab.content.substring(0, start) + replaceText + activeTab.content.substring(end);
      updateActiveContent(updated);
      setTimeout(() => {
        handleFindNext();
      }, 0);
    } else {
      handleFindNext();
    }
  };

  const handleReplaceAll = () => {
    if (!findText || !activeTab) return;
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), matchCase ? 'g' : 'gi');
    const updated = activeTab.content.replace(regex, replaceText);
    updateActiveContent(updated);
  };

  // Calculations
  const textContent = activeTab?.content || '';
  const linesCount = textContent.split('\n').length;
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = textContent.length;

  return (
    <div className="w-full h-full bg-[#ffffff] text-[#0f172a] flex flex-col overflow-hidden font-sans select-text border border-[#cbd5e1] shadow-2xl">
      
      {/* Hidden file input for File -> Open */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleOpenFile} 
        accept=".txt,.md,.js,.ts,.tsx,.json,.html,.css,.py,.csv" 
        className="hidden" 
      />

      {/* ─── 1. TOP TAB BAR (Window Header with Traffic Light Clearance) ──────── */}
      <div className="h-10 bg-[#f1f5f9] border-b border-[#e2e8f0] flex items-center px-2 pl-24 md:pl-28 select-none shrink-0 relative">
        
        {/* Document Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar h-full pt-1.5 flex-1 max-w-full">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-md text-xs font-normal transition-all cursor-pointer border-t border-x relative shrink-0 ${
                  isActive
                    ? 'bg-[#ffffff] text-[#0f172a] border-[#cbd5e1] border-b-transparent shadow-[0_-1px_2px_rgba(0,0,0,0.04)] font-medium -mb-[1px] z-10'
                    : 'bg-transparent text-[#64748b] border-transparent hover:bg-[#e2e8f0]/60 hover:text-[#1e293b]'
                }`}
                style={{ maxWidth: '200px' }}
              >
                <FileText size={13} className={isActive ? 'text-[#2563eb]' : 'text-[#94a3b8]'} />
                <span className="truncate flex-1">{tab.title}{tab.isModified ? ' *' : ''}</span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#e2e8f0] transition-colors"
                  title="Close tab"
                >
                  <X size={11} />
                </button>
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            onClick={() => createNewTab()}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0] transition-colors mb-0.5 ml-1"
            title="New Tab (Ctrl+N)"
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Right Tab Controls */}
        <div className="flex items-center gap-1 pl-2">
          <button
            onClick={() => setShowFindBar(!showFindBar)}
            className={`p-1.5 rounded text-xs transition-colors ${
              showFindBar ? 'bg-[#2563eb] text-white' : 'text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#0f172a]'
            }`}
            title="Find & Replace (Ctrl+F)"
          >
            <Search size={14} />
          </button>
        </div>
      </div>

      {/* ─── 2. AUTHENTIC MENU BAR (File | Edit | Format | View | Help) ──────── */}
      <div ref={menuBarRef} className="h-7 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center px-2 text-xs text-[#334155] select-none shrink-0 relative z-20">
        
        {/* FILE MENU */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              openMenu === 'file' ? 'bg-[#e2e8f0] text-[#0f172a]' : 'hover:bg-[#e2e8f0]/80'
            }`}
          >
            File
          </button>

          {openMenu === 'file' && (
            <div className="absolute top-full left-0 mt-0.5 w-56 bg-[#ffffff] border border-[#cbd5e1] rounded-md shadow-lg py-1 text-xs text-[#1e293b] z-50">
              <button onClick={() => createNewTab()} className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer">
                <span>New Tab</span>
                <span className="text-[#94a3b8]">Ctrl+N</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer">
                <span>Open...</span>
                <span className="text-[#94a3b8]">Ctrl+O</span>
              </button>
              <button onClick={handleSaveFile} className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer">
                <span>Save</span>
                <span className="text-[#94a3b8]">Ctrl+S</span>
              </button>
              <button onClick={handleSaveFile} className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer">
                <span>Save As...</span>
                <span className="text-[#94a3b8]">Ctrl+Shift+S</span>
              </button>
              <div className="my-1 border-t border-[#e2e8f0]" />
              <button onClick={handlePrint} className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer">
                <span>Print...</span>
                <span className="text-[#94a3b8]">Ctrl+P</span>
              </button>
              <div className="my-1 border-t border-[#e2e8f0]" />
              <button onClick={() => closeTab(activeTabId)} className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] text-[#ef4444] cursor-pointer">
                <span>Close Tab</span>
                <span className="text-[#94a3b8]">Ctrl+W</span>
              </button>
            </div>
          )}
        </div>

        {/* EDIT MENU */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              openMenu === 'edit' ? 'bg-[#e2e8f0] text-[#0f172a]' : 'hover:bg-[#e2e8f0]/80'
            }`}
          >
            Edit
          </button>

          {openMenu === 'edit' && (
            <div className="absolute top-full left-0 mt-0.5 w-56 bg-[#ffffff] border border-[#cbd5e1] rounded-md shadow-lg py-1 text-xs text-[#1e293b] z-50">
              <button 
                onClick={() => {
                  setShowFindBar(true);
                  setOpenMenu(null);
                }} 
                className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer"
              >
                <span>Find...</span>
                <span className="text-[#94a3b8]">Ctrl+F</span>
              </button>
              <button 
                onClick={() => {
                  setShowFindBar(true);
                  setOpenMenu(null);
                }} 
                className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer"
              >
                <span>Replace...</span>
                <span className="text-[#94a3b8]">Ctrl+H</span>
              </button>
              <div className="my-1 border-t border-[#e2e8f0]" />
              <button onClick={handleSelectAll} className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer">
                <span>Select All</span>
                <span className="text-[#94a3b8]">Ctrl+A</span>
              </button>
              <button onClick={insertDateTime} className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer">
                <span>Time/Date</span>
                <span className="text-[#94a3b8]">F5</span>
              </button>
            </div>
          )}
        </div>

        {/* FORMAT MENU */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'format' ? null : 'format')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              openMenu === 'format' ? 'bg-[#e2e8f0] text-[#0f172a]' : 'hover:bg-[#e2e8f0]/80'
            }`}
          >
            Format
          </button>

          {openMenu === 'format' && (
            <div className="absolute top-full left-0 mt-0.5 w-60 bg-[#ffffff] border border-[#cbd5e1] rounded-md shadow-lg py-1 text-xs text-[#1e293b] z-50">
              {/* Word Wrap toggle */}
              <button 
                onClick={() => {
                  setWordWrap(!wordWrap);
                  setOpenMenu(null);
                }} 
                className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#f1f5f9] cursor-pointer"
              >
                <span>Word Wrap</span>
                {wordWrap && <Check size={14} className="text-[#2563eb]" />}
              </button>

              <div className="my-1 border-t border-[#e2e8f0]" />
              <div className="px-3 py-1 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">Font Family</div>
              
              <button 
                onClick={() => { setFontFamily('Consolas, "Cascadia Code", "Courier New", monospace'); setOpenMenu(null); }}
                className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#f1f5f9] font-mono cursor-pointer"
              >
                <span>Consolas (Monospace)</span>
                {fontFamily.includes('Consolas') && <Check size={14} className="text-[#2563eb]" />}
              </button>
              <button 
                onClick={() => { setFontFamily('"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif'); setOpenMenu(null); }}
                className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#f1f5f9] cursor-pointer"
              >
                <span>Segoe UI (Modern)</span>
                {fontFamily.includes('Segoe UI') && <Check size={14} className="text-[#2563eb]" />}
              </button>
              <button 
                onClick={() => { setFontFamily('Georgia, Cambria, "Times New Roman", serif'); setOpenMenu(null); }}
                className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#f1f5f9] font-serif cursor-pointer"
              >
                <span>Georgia (Serif)</span>
                {fontFamily.includes('Georgia') && <Check size={14} className="text-[#2563eb]" />}
              </button>

              <div className="my-1 border-t border-[#e2e8f0]" />
              <div className="px-3 py-1 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">Font Size</div>
              <div className="px-3 py-1 flex items-center gap-1.5">
                {[12, 14, 16, 18, 20].map(size => (
                  <button
                    key={size}
                    onClick={() => { setFontSize(size); setOpenMenu(null); }}
                    className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                      fontSize === size ? 'bg-[#2563eb] text-white font-medium' : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* VIEW MENU */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              openMenu === 'view' ? 'bg-[#e2e8f0] text-[#0f172a]' : 'hover:bg-[#e2e8f0]/80'
            }`}
          >
            View
          </button>

          {openMenu === 'view' && (
            <div className="absolute top-full left-0 mt-0.5 w-56 bg-[#ffffff] border border-[#cbd5e1] rounded-md shadow-lg py-1 text-xs text-[#1e293b] z-50">
              <button 
                onClick={() => { setZoomPercent(prev => Math.min(200, prev + 10)); setOpenMenu(null); }} 
                className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer"
              >
                <span>Zoom In</span>
                <span className="text-[#94a3b8]">Ctrl++</span>
              </button>
              <button 
                onClick={() => { setZoomPercent(prev => Math.max(70, prev - 10)); setOpenMenu(null); }} 
                className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer"
              >
                <span>Zoom Out</span>
                <span className="text-[#94a3b8]">Ctrl+-</span>
              </button>
              <button 
                onClick={() => { setZoomPercent(100); setOpenMenu(null); }} 
                className="w-full px-3 py-1.5 text-left flex justify-between hover:bg-[#f1f5f9] cursor-pointer"
              >
                <span>Restore Default Zoom</span>
                <span className="text-[#94a3b8]">Ctrl+0</span>
              </button>
              <div className="my-1 border-t border-[#e2e8f0]" />
              <button 
                onClick={() => { setShowStatusBar(!showStatusBar); setOpenMenu(null); }} 
                className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#f1f5f9] cursor-pointer"
              >
                <span>Status Bar</span>
                {showStatusBar && <Check size={14} className="text-[#2563eb]" />}
              </button>
            </div>
          )}
        </div>

        {/* HELP MENU */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              openMenu === 'help' ? 'bg-[#e2e8f0] text-[#0f172a]' : 'hover:bg-[#e2e8f0]/80'
            }`}
          >
            Help
          </button>

          {openMenu === 'help' && (
            <div className="absolute top-full left-0 mt-0.5 w-48 bg-[#ffffff] border border-[#cbd5e1] rounded-md shadow-lg py-1 text-xs text-[#1e293b] z-50">
              <button 
                onClick={() => { setShowAboutModal(true); setOpenMenu(null); }} 
                className="w-full px-3 py-1.5 text-left hover:bg-[#f1f5f9] cursor-pointer"
              >
                About Notepad
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── 3. FIND & REPLACE FLOATING TOOLBAR ──────────────────── */}
      {showFindBar && (
        <div className="bg-[#f8fafc] border-b border-[#cbd5e1] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none shadow-sm z-10">
          <div className="flex flex-wrap items-center gap-2">
            {/* Find field */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Find"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleFindNext(); }}
                className="w-44 px-2.5 py-1 text-xs bg-white border border-[#cbd5e1] rounded outline-none focus:border-[#2563eb]"
                autoFocus
              />
              {findText && (
                <span className="ml-2 text-[11px] text-[#64748b] font-mono">
                  {findMatchCount} match{findMatchCount === 1 ? '' : 'es'}
                </span>
              )}
            </div>

            {/* Replace field */}
            <input
              type="text"
              placeholder="Replace with"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="w-44 px-2.5 py-1 text-xs bg-white border border-[#cbd5e1] rounded outline-none focus:border-[#2563eb]"
            />

            {/* Action buttons */}
            <button
              onClick={handleFindNext}
              className="px-2.5 py-1 rounded bg-[#ffffff] hover:bg-[#e2e8f0] border border-[#cbd5e1] text-[#1e293b] cursor-pointer font-medium"
            >
              Find Next
            </button>
            <button
              onClick={handleReplace}
              className="px-2.5 py-1 rounded bg-[#ffffff] hover:bg-[#e2e8f0] border border-[#cbd5e1] text-[#1e293b] cursor-pointer font-medium"
            >
              Replace
            </button>
            <button
              onClick={handleReplaceAll}
              className="px-2.5 py-1 rounded bg-[#ffffff] hover:bg-[#e2e8f0] border border-[#cbd5e1] text-[#1e293b] cursor-pointer font-medium"
            >
              Replace All
            </button>

            {/* Match case checkbox */}
            <label className="flex items-center gap-1.5 ml-2 cursor-pointer text-[#475569]">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="rounded border-[#cbd5e1] text-[#2563eb]"
              />
              <span>Match case</span>
            </label>
          </div>

          {/* Close Find */}
          <button
            onClick={() => setShowFindBar(false)}
            className="p-1 text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0] rounded cursor-pointer"
            title="Close"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ─── 4. PURE WHITE MAIN WRITING CANVAS ──────────────────── */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#ffffff]">
        <textarea
          ref={textareaRef}
          value={activeTab?.content || ''}
          onChange={(e) => {
            updateActiveContent(e.target.value);
            updateCursorMetrics();
          }}
          onClick={updateCursorMetrics}
          onKeyUp={updateCursorMetrics}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          style={{
            fontFamily,
            fontSize: `${(fontSize * (zoomPercent / 100)).toFixed(1)}px`,
            lineHeight: 1.6,
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            wordBreak: wordWrap ? 'break-word' : 'normal'
          }}
          className="w-full h-full p-6 bg-[#ffffff] text-[#0f172a] outline-none border-none resize-none leading-relaxed selection:bg-[#bfdbfe] selection:text-[#1e3a8a] overflow-auto focus:ring-0"
          placeholder="Start typing your text here..."
        />
      </div>

      {/* ─── 5. STATUS BAR (Line, Col, Encoding, Windows CRLF) ────── */}
      {showStatusBar && (
        <div className="h-6 bg-[#f1f5f9] border-t border-[#e2e8f0] px-3 flex items-center justify-between text-[11px] text-[#64748b] select-none font-mono shrink-0">
          <div className="flex items-center gap-4">
            <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">{linesCount} lines, {wordCount} words, {charCount} characters</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline">{zoomPercent}%</span>
            <span className="hidden sm:inline">|</span>
            <span>Windows (CRLF)</span>
            <span className="hidden sm:inline">|</span>
            <span>UTF-8</span>
          </div>
        </div>
      )}

      {/* ─── 6. ABOUT NOTEPAD DIALOG MODAL ───────────────────────── */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="w-[420px] bg-[#ffffff] rounded-lg shadow-2xl border border-[#cbd5e1] overflow-hidden select-none">
            {/* Modal Title */}
            <div className="bg-[#f1f5f9] px-4 py-2.5 border-b border-[#e2e8f0] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0f172a] flex items-center gap-2">
                <FileText size={15} className="text-[#2563eb]" />
                About Portfolio OS Notepad
              </span>
              <button 
                onClick={() => setShowAboutModal(false)}
                className="text-[#64748b] hover:text-[#0f172a] p-1 rounded"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-xs text-[#334155] space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-[#f1f5f9]">
                <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center">
                  <FileText size={26} className="text-[#2563eb]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0f172a]">Portfolio OS Notepad</h4>
                  <p className="text-[11px] text-[#64748b]">Version 1.0 (Build 2026.10)</p>
                </div>
              </div>

              <p className="leading-relaxed">
                A clean, ultra-realistic desktop text editor designed specifically for Portfolio OS with full file operations, document tab virtualization, and instant local storage caching.
              </p>

              <div className="bg-[#f8fafc] p-3 rounded border border-[#e2e8f0] space-y-1 font-mono text-[10px] text-[#64748b]">
                <div>• Architecture: React 19 + TypeScript + Native DOM</div>
                <div>• Theme: Pure High-Fidelity White Paper</div>
                <div>• Encodings: UTF-8 / Windows CRLF Compatible</div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="px-4 py-1.5 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-medium cursor-pointer transition-colors shadow-sm"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
