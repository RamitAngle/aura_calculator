import React, { useState } from 'react';
import { History, Trash2, X, ArrowUpRight, Copy, Check } from 'lucide-react';
import { HistoryItem } from '../types/calculator';
import { formatDisplayNumber } from '../utils/calculator';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.result);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end p-4 sm:p-6 bg-slate-950/30 dark:bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-sm sm:h-[600px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        role="dialog"
        aria-label="Calculation History"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <History className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              History
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              ({history.length})
            </span>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Clear all history"
                aria-label="Clear history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close history"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100 dark:divide-slate-800/50 space-y-1">
          {history.length === 0 ? (
            <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <History className="w-6 h-6 opacity-60" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No calculations yet</p>
              <p className="text-xs mt-1 max-w-[200px]">
                Your calculation trail will appear here automatically.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistory(item)}
                className="group relative p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-all duration-150"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity">
                    <button
                      onClick={(e) => handleCopy(e, item)}
                      className="p-1 rounded-md text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 shadow-xs"
                      title="Copy result"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center">
                      Use <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate mb-0.5">
                  {item.expression}
                </div>

                <div className="text-lg font-mono font-semibold text-slate-900 dark:text-white truncate">
                  {formatDisplayNumber(item.result)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {history.length > 0 && (
          <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-center text-slate-400">
            Click any entry to load back into calculator
          </div>
        )}
      </div>
    </div>
  );
};
