import React from 'react';

export type ButtonVariant = 'digit' | 'operator' | 'action' | 'equals';

interface CalcButtonProps {
  label: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  isActive?: boolean;
  className?: string;
  span?: 1 | 2;
  ariaLabel?: string;
}

export const CalcButton: React.FC<CalcButtonProps> = ({
  label,
  onClick,
  variant = 'digit',
  isActive = false,
  className = '',
  span = 1,
  ariaLabel,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'equals':
        return 'bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:shadow-indigo-500/20 border-transparent';
      case 'operator':
        if (isActive) {
          return 'bg-indigo-600 text-white font-semibold shadow-glow-primary ring-2 ring-indigo-400 dark:ring-indigo-300 border-transparent';
        }
        return 'bg-indigo-50/80 hover:bg-indigo-100/90 text-indigo-600 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 dark:text-indigo-300 font-semibold border-indigo-200/70 dark:border-indigo-800/60 shadow-xs';
      case 'action':
        return 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-300 font-medium border-slate-200/70 dark:border-slate-700/60 shadow-xs';
      case 'digit':
      default:
        return 'bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-100 font-medium border-slate-200/80 dark:border-slate-700/70 shadow-sm';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
      className={`
        relative select-none flex items-center justify-center
        h-14 sm:h-16 rounded-2xl text-lg sm:text-xl
        border transition-all duration-150 ease-out
        active:scale-[0.96] active:translate-y-0.5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
        ${span === 2 ? 'col-span-2' : 'col-span-1'}
        ${getVariantStyles()}
        ${className}
      `}
    >
      <span className="flex items-center justify-center pointer-events-none">
        {label}
      </span>
    </button>
  );
};
