import React from 'react';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local precision engine</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Zero latency</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Fast keyboard navigation
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 hidden sm:flex">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            Private & client-only
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <span>Crafted with</span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 inline mx-0.5" />
          <span>AuraCalc</span>
        </div>
      </div>
    </footer>
  );
};
