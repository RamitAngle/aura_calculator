export type CalculatorOperation = '+' | '-' | '×' | '÷' | null;

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorState {
  display: string;
  expression: string;
  previousValue: number | null;
  operation: CalculatorOperation;
  overwrite: boolean;
  isError: boolean;
}

export type KeyActionType =
  | 'digit'
  | 'decimal'
  | 'operator'
  | 'equals'
  | 'clear'
  | 'backspace'
  | 'percent'
  | 'negate'
  | 'square'
  | 'sqrt';
