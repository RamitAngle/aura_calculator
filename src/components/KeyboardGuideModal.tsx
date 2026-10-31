import React, { useEffect } from 'react';
import { X, Keyboard, CornerDownLeft, Delete } from 'lucide-react';

interface KeyboardGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardGuideModal: React.FC<KeyboardGuideModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 – 9', desc: 'Enter numbers' },
    { key: '+  −  *  /', desc: 'Basic arithmetic (+, −, ×, ÷)' },
    { key: 'Enter  or  =', desc: 'Calculate equal result', icon: <CornerDownLeft className="w-3.5 h-3.5 inline ml-1" /> },
    { key: 'Backspace', desc: 'Delete last entered character', icon: <Delete className="w-3.5 h-3.5 inline ml-1" /> },
    { key: 'Esc  or  c', desc: 'Clear all (AC)' },
    { key: '%', desc: 'Percentage calculation' },
    { key: '.', desc: 'Decimal point' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="keyboard-shortcuts-title" className="text-base font-semibold text-slate-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Operate AuraCalc entirely from your keyboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close shortcuts guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/80">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-600 dark:text-slate-300 flex items-center">
                {sc.desc}
              </span>
              <kbd className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono rounded-lg shadow-sm font-semibold flex items-center gap-1">
                {sc.key}
                {sc.icon}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-sm"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
