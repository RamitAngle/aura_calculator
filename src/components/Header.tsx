import React from 'react';
import { Moon, Sun, Volume2, VolumeX, Keyboard, Sparkles } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  isMuted,
  onToggleSound,
  onOpenShortcuts,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-4 sm:py-8 flex items-center justify-between">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <div className="relative group flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-md shadow-indigo-500/25 text-white transition-transform duration-300 group-hover:scale-105">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Aura<span className="text-indigo-600 dark:text-indigo-400">Calc</span>
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              v1.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
            Precision mathematical canvas
          </p>
        </div>
      </div>

      {/* Header quick actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Keyboard Shortcuts Button */}
        <button
          onClick={onOpenShortcuts}
          className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm backdrop-blur-md transition-all duration-200 flex items-center gap-2 group active:scale-95"
          title="Keyboard shortcuts"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          <span className="hidden md:inline text-xs font-medium">Shortcuts</span>
        </button>

        {/* Audio click feedback toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 sm:px-3 sm:py-2 rounded-xl border shadow-sm backdrop-blur-md transition-all duration-200 flex items-center gap-2 active:scale-95 ${
            isMuted
              ? 'text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60'
              : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-200/80 dark:border-indigo-800/70'
          }`}
          title={isMuted ? 'Turn sound effects on' : 'Mute sound effects'}
          aria-label="Toggle sound effects"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="hidden md:inline text-xs font-medium">
            {isMuted ? 'Muted' : 'Sound'}
          </span>
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm backdrop-blur-md transition-all duration-200 flex items-center gap-2 group active:scale-95"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              <span className="hidden md:inline text-xs font-medium">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
              <span className="hidden md:inline text-xs font-medium">Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
