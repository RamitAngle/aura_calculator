import React, { useState, useEffect } from 'react';
import { 
  History, 
  Delete, 
  Copy, 
  Check, 
  Divide, 
  X as Multiply, 
  Minus, 
  Plus, 
  Equal, 
  Percent, 
  Sparkles
} from 'lucide-react';
import { CalcButton } from './CalcButton';
import { CalculatorOperation, CalculatorState, HistoryItem } from '../types/calculator';
import { 
  formatDisplayNumber, 
  handleDigit, 
  handleDecimal, 
  handleBackspace, 
  handleNegate, 
  handlePercent, 
  handleOperator, 
  handleEquals, 
  INITIAL_STATE 
} from '../utils/calculator';
import { soundManager } from '../utils/sound';

interface CalculatorProps {
  history: HistoryItem[];
  onAddHistory: (item: HistoryItem) => void;
  onOpenHistory: () => void;
  restoredItem?: HistoryItem | null;
}

export const Calculator: React.FC<CalculatorProps> = ({
  history,
  onAddHistory,
  onOpenHistory,
  restoredItem,
}) => {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Restore calculation if requested from history drawer
  useEffect(() => {
    if (restoredItem) {
      setState({
        ...INITIAL_STATE,
        display: restoredItem.result,
        expression: restoredItem.expression,
        overwrite: true,
      });
    }
  }, [restoredItem]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is in input/textarea/dialog inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        soundManager.play('digit');
        setState((prev) => handleDigit(prev, e.key));
      } else if (e.key === '.') {
        e.preventDefault();
        soundManager.play('digit');
        setState((prev) => handleDecimal(prev));
      } else if (e.key === '+' || e.key === '-') {
        e.preventDefault();
        soundManager.play('operator');
        setState((prev) => handleOperator(prev, e.key as CalculatorOperation, onAddHistory));
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        soundManager.play('operator');
        setState((prev) => handleOperator(prev, '×', onAddHistory));
      } else if (e.key === '/') {
        e.preventDefault();
        soundManager.play('operator');
        setState((prev) => handleOperator(prev, '÷', onAddHistory));
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        soundManager.play('equals');
        setState((prev) => handleEquals(prev, onAddHistory));
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        soundManager.play('delete');
        setState((prev) => handleBackspace(prev));
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        soundManager.play('clear');
        setState(INITIAL_STATE);
      } else if (e.key === '%') {
        e.preventDefault();
        soundManager.play('operator');
        setState((prev) => handlePercent(prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddHistory]);

  // Copy current display value to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(state.display);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Ignore clipboard error if blocked
    }
  };

  // Actions
  const onDigit = (digit: string) => {
    soundManager.play('digit');
    setState((prev) => handleDigit(prev, digit));
  };

  const onDecimal = () => {
    soundManager.play('digit');
    setState((prev) => handleDecimal(prev));
  };

  const onBackspace = () => {
    soundManager.play('delete');
    setState((prev) => handleBackspace(prev));
  };

  const onClear = () => {
    soundManager.play('clear');
    setState(INITIAL_STATE);
  };

  const onNegate = () => {
    soundManager.play('operator');
    setState((prev) => handleNegate(prev));
  };

  const onPercent = () => {
    soundManager.play('operator');
    setState((prev) => handlePercent(prev));
  };

  const onOperator = (op: CalculatorOperation) => {
    soundManager.play('operator');
    setState((prev) => handleOperator(prev, op, onAddHistory));
  };

  const onEquals = () => {
    soundManager.play('equals');
    setState((prev) => handleEquals(prev, onAddHistory));
  };

  // Calculate dynamic font size based on string length
  const getDisplayFontSize = (text: string) => {
    const len = text.length;
    if (len > 14) return 'text-2xl sm:text-3xl';
    if (len > 10) return 'text-3xl sm:text-4xl';
    if (len > 7) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl';
  };

  const formattedDisplay = formatDisplayNumber(state.display);

  return (
    <div className="w-full max-w-[380px] sm:max-w-[420px] mx-auto select-none">
      {/* Outer Glow & Card Container */}
      <div className="relative group">
        {/* Subtle Ambient Glow behind calculator */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[2.5rem] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-[2.25rem] shadow-2xl p-5 sm:p-6 transition-all duration-300">
          
          {/* Card Top Utility Bar */}
          <div className="flex items-center justify-between pb-3 text-xs text-slate-500 dark:text-slate-400">
            {/* History toggle button */}
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors active:scale-95 group/btn"
              title="Open Calculation History"
              aria-label="View history"
            >
              <History className="w-4 h-4 text-slate-500 group-hover/btn:text-indigo-600 dark:group-hover/btn:text-indigo-400 transition-colors" />
              <span className="font-medium text-xs">History</span>
              {history.length > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400">
                  {history.length}
                </span>
              )}
            </button>

            {/* Middle subtle brand badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100/70 dark:bg-slate-800/50 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Standard</span>
            </div>

            {/* Copy button with toast state */}
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all active:scale-95 ${
                isCopied
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title="Copy current result"
              aria-label="Copy result"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Calculator Display Screen */}
          <div className="relative mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-50/90 to-slate-100/80 dark:from-slate-950/70 dark:to-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 shadow-inner flex flex-col justify-end min-h-[110px] sm:min-h-[125px] overflow-hidden">
            {/* Expression history trail */}
            <div className="h-6 flex items-center justify-end text-xs sm:text-sm font-mono text-slate-400 dark:text-slate-500 tracking-wide overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-none">
              {state.expression || '\u00A0'}
            </div>

            {/* Current value / Main display */}
            <div 
              className={`text-right font-mono font-bold tracking-tight transition-all duration-150 truncate ${
                state.isError ? 'text-rose-500 text-2xl sm:text-3xl' : 'text-slate-900 dark:text-white ' + getDisplayFontSize(formattedDisplay)
              }`}
              aria-live="polite"
            >
              {formattedDisplay}
            </div>
          </div>

          {/* Keypad Grid (4 Columns x 5 Rows) */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {/* Row 1: Clear, Backspace, Percent, Divide */}
            <CalcButton
              label={state.display !== '0' && !state.overwrite ? 'C' : 'AC'}
              onClick={onClear}
              variant="action"
              className="text-indigo-600 dark:text-indigo-400 font-bold"
              ariaLabel="Clear all"
            />
            <CalcButton
              label={<Delete className="w-5 h-5 sm:w-6 sm:h-6" />}
              onClick={onBackspace}
              variant="action"
              ariaLabel="Backspace"
            />
            <CalcButton
              label={<Percent className="w-4 h-4 sm:w-5 sm:h-5" />}
              onClick={onPercent}
              variant="action"
              ariaLabel="Percent"
            />
            <CalcButton
              label={<Divide className="w-5 h-5 sm:w-6 sm:h-6" />}
              onClick={() => onOperator('÷')}
              variant="operator"
              isActive={state.operation === '÷' && state.overwrite}
              ariaLabel="Divide"
            />

            {/* Row 2: 7, 8, 9, Multiply */}
            <CalcButton label="7" onClick={() => onDigit('7')} />
            <CalcButton label="8" onClick={() => onDigit('8')} />
            <CalcButton label="9" onClick={() => onDigit('9')} />
            <CalcButton
              label={<Multiply className="w-5 h-5 sm:w-6 sm:h-6" />}
              onClick={() => onOperator('×')}
              variant="operator"
              isActive={state.operation === '×' && state.overwrite}
              ariaLabel="Multiply"
            />

            {/* Row 3: 4, 5, 6, Subtract */}
            <CalcButton label="4" onClick={() => onDigit('4')} />
            <CalcButton label="5" onClick={() => onDigit('5')} />
            <CalcButton label="6" onClick={() => onDigit('6')} />
            <CalcButton
              label={<Minus className="w-5 h-5 sm:w-6 sm:h-6" />}
              onClick={() => onOperator('-')}
              variant="operator"
              isActive={state.operation === '-' && state.overwrite}
              ariaLabel="Subtract"
            />

            {/* Row 4: 1, 2, 3, Add */}
            <CalcButton label="1" onClick={() => onDigit('1')} />
            <CalcButton label="2" onClick={() => onDigit('2')} />
            <CalcButton label="3" onClick={() => onDigit('3')} />
            <CalcButton
              label={<Plus className="w-5 h-5 sm:w-6 sm:h-6" />}
              onClick={() => onOperator('+')}
              variant="operator"
              isActive={state.operation === '+' && state.overwrite}
              ariaLabel="Add"
            />

            {/* Row 5: Negate (+/-), 0, Decimal (.), Equals (=) */}
            <CalcButton
              label={<span className="text-xl font-semibold leading-none">±</span>}
              onClick={onNegate}
              variant="action"
              ariaLabel="Plus/Minus"
            />
            <CalcButton label="0" onClick={() => onDigit('0')} />
            <CalcButton label="." onClick={onDecimal} ariaLabel="Decimal point" />
            <CalcButton
              label={<Equal className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />}
              onClick={onEquals}
              variant="equals"
              ariaLabel="Equals"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
