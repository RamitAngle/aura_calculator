import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Calculator } from './components/Calculator';
import { HistoryDrawer } from './components/HistoryDrawer';
import { KeyboardGuideModal } from './components/KeyboardGuideModal';
import { HistoryItem } from './types/calculator';
import { soundManager } from './utils/sound';
import { Keyboard, History, Volume2, Shield } from 'lucide-react';

export function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('auracalc_theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [restoredItem, setRestoredItem] = useState<HistoryItem | null>(null);

  // History state with localStorage persistence
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('auracalc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply dark mode class to root HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('auracalc_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('auracalc_theme', 'light');
    }
  }, [isDark]);

  // Persist history changes
  useEffect(() => {
    try {
      localStorage.setItem('auracalc_history', JSON.stringify(history));
    } catch {
      // storage limit or disabled
    }
  }, [history]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    soundManager.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundManager.play('digit');
    }
  };

  const handleAddHistory = useCallback((item: HistoryItem) => {
    setHistory((prev) => [item, ...prev].slice(0, 30)); // retain latest 30
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setRestoredItem(item);
    setIsHistoryOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden transition-colors duration-300">
      {/* Decorative ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl dark:from-indigo-600/15 dark:via-purple-600/15" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[400px] bg-gradient-to-tl from-violet-500/10 via-sky-500/10 to-transparent rounded-full blur-3xl dark:from-violet-600/10 dark:via-sky-600/10" />
      </div>

      {/* Header */}
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-8 w-full max-w-4xl mx-auto">
        {/* Subtle Hero Header */}
        <div className="text-center mb-6 sm:mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-300/40 dark:border-slate-700/50 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            Modern • Fast • Minimal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Simple calculations, refined experience.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Everything you need for everyday math with delightful responsiveness and seamless keyboard flow.
          </p>
        </div>

        {/* Centered Calculator */}
        <div className="w-full flex justify-center">
          <Calculator
            history={history}
            onAddHistory={handleAddHistory}
            onOpenHistory={() => setIsHistoryOpen(true)}
            restoredItem={restoredItem}
          />
        </div>

        {/* Feature Badges below Calculator */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs backdrop-blur-sm transition-all"
          >
            <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
            <span>Keyboard shortcuts</span>
          </button>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs backdrop-blur-sm transition-all"
          >
            <History className="w-3.5 h-3.5 text-indigo-500" />
            <span>History drawer</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 shadow-xs backdrop-blur-sm">
            <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Haptic sound</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 shadow-xs backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>Precision rounding</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardGuideModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}

export default App;
