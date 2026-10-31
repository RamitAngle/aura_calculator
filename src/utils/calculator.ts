import { CalculatorOperation, CalculatorState, HistoryItem } from '../types/calculator';

export const INITIAL_STATE: CalculatorState = {
  display: '0',
  expression: '',
  previousValue: null,
  operation: null,
  overwrite: true,
  isError: false,
};

// Maximum digits allowed in the input to prevent visual break
export const MAX_DIGITS = 15;

/**
 * Clean floating point arithmetic precision issues (e.g. 0.1 + 0.2 -> 0.3)
 */
export function cleanPrecision(value: number): number {
  if (!isFinite(value)) return value;
  // Use toPrecision to avoid floating point inaccuracies
  return parseFloat(value.toPrecision(12));
}

/**
 * Format a number string for clean human-readable display with commas
 */
export function formatDisplayNumber(valueStr: string): string {
  if (valueStr === 'Cannot divide by 0' || valueStr === 'Error' || valueStr === 'Infinity' || valueStr === '-Infinity') {
    return valueStr;
  }

  // Handle negative sign
  const isNegative = valueStr.startsWith('-');
  const cleanStr = isNegative ? valueStr.slice(1) : valueStr;

  // If scientific notation
  if (cleanStr.includes('e') || cleanStr.includes('E')) {
    return valueStr;
  }

  const parts = cleanStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : null;

  // Add commas to integer part
  const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let result = (isNegative ? '-' : '') + formattedInt;
  if (decimalPart !== null) {
    result += '.' + decimalPart;
  }

  return result;
}

/**
 * Perform single arithmetic operation
 */
export function calculate(prev: number, current: number, operation: CalculatorOperation): number | 'ERROR_DIV_ZERO' {
  let result: number;
  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '×':
      result = prev * current;
      break;
    case '÷':
      if (current === 0) {
        return 'ERROR_DIV_ZERO';
      }
      result = prev / current;
      break;
    default:
      return current;
  }
  return cleanPrecision(result);
}

/**
 * Handle input of a digit (0-9 or 00)
 */
export function handleDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.isError) {
    return {
      ...INITIAL_STATE,
      display: digit === '00' ? '0' : digit,
      overwrite: false,
    };
  }

  if (state.overwrite) {
    return {
      ...state,
      display: digit === '00' ? '0' : digit,
      overwrite: false,
    };
  }

  // Limit input length
  const digitsOnly = state.display.replace(/[^0-9]/g, '');
  if (digitsOnly.length >= MAX_DIGITS) {
    return state;
  }

  if (state.display === '0') {
    return {
      ...state,
      display: digit === '00' ? '0' : digit,
    };
  }

  return {
    ...state,
    display: state.display + digit,
  };
}

/**
 * Handle decimal point
 */
export function handleDecimal(state: CalculatorState): CalculatorState {
  if (state.isError || state.overwrite) {
    return {
      ...state,
      display: '0.',
      overwrite: false,
      isError: false,
    };
  }

  if (state.display.includes('.')) {
    return state;
  }

  return {
    ...state,
    display: state.display + '.',
  };
}

/**
 * Handle Backspace / Delete
 */
export function handleBackspace(state: CalculatorState): CalculatorState {
  if (state.isError || state.overwrite) {
    return {
      ...state,
      display: '0',
      overwrite: true,
      isError: false,
    };
  }

  if (state.display.length <= 1 || (state.display.length === 2 && state.display.startsWith('-'))) {
    return {
      ...state,
      display: '0',
      overwrite: true,
    };
  }

  return {
    ...state,
    display: state.display.slice(0, -1),
  };
}

/**
 * Handle Negate (+/-)
 */
export function handleNegate(state: CalculatorState): CalculatorState {
  if (state.isError || state.display === '0') {
    return state;
  }

  const num = parseFloat(state.display);
  const toggled = -num;

  return {
    ...state,
    display: toggled.toString(),
  };
}

/**
 * Handle Percentage (%)
 */
export function handlePercent(state: CalculatorState): CalculatorState {
  if (state.isError) return state;

  const current = parseFloat(state.display);
  if (isNaN(current)) return state;

  let calculatedVal: number;

  if (state.previousValue !== null && state.operation) {
    // If working in context of an operation e.g. 200 + 15% -> 200 * 0.15 = 30
    if (state.operation === '+' || state.operation === '-') {
      calculatedVal = (state.previousValue * current) / 100;
    } else {
      // For multiplication or division: 200 * 15% -> 0.15
      calculatedVal = current / 100;
    }
  } else {
    calculatedVal = current / 100;
  }

  const cleaned = cleanPrecision(calculatedVal);

  return {
    ...state,
    display: cleaned.toString(),
    overwrite: true,
  };
}

/**
 * Handle operator (+, -, ×, ÷)
 */
export function handleOperator(
  state: CalculatorState,
  op: CalculatorOperation,
  addHistory?: (item: HistoryItem) => void
): CalculatorState {
  if (state.isError) {
    return {
      ...INITIAL_STATE,
      operation: op,
    };
  }

  const currentNum = parseFloat(state.display);

  if (state.previousValue === null) {
    return {
      ...state,
      previousValue: currentNum,
      operation: op,
      expression: `${formatDisplayNumber(state.display)} ${op}`,
      overwrite: true,
    };
  }

  // If user just changed operator without entering a new number
  if (state.overwrite && state.operation !== null) {
    return {
      ...state,
      operation: op,
      expression: `${formatDisplayNumber(state.previousValue.toString())} ${op}`,
    };
  }

  // Chain calculation
  const result = calculate(state.previousValue, currentNum, state.operation);

  if (result === 'ERROR_DIV_ZERO') {
    return {
      ...state,
      display: 'Cannot divide by 0',
      expression: `${state.expression} ${formatDisplayNumber(state.display)} =`,
      previousValue: null,
      operation: null,
      overwrite: true,
      isError: true,
    };
  }

  const fullExpression = `${state.expression} ${formatDisplayNumber(state.display)}`;
  
  if (addHistory) {
    addHistory({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      expression: fullExpression,
      result: result.toString(),
      timestamp: Date.now(),
    });
  }

  return {
    ...state,
    display: result.toString(),
    previousValue: result,
    operation: op,
    expression: `${formatDisplayNumber(result.toString())} ${op}`,
    overwrite: true,
  };
}

/**
 * Handle Equals (=)
 */
export function handleEquals(
  state: CalculatorState,
  addHistory?: (item: HistoryItem) => void
): CalculatorState {
  if (state.isError || state.previousValue === null || state.operation === null) {
    return state;
  }

  const currentNum = parseFloat(state.display);
  const result = calculate(state.previousValue, currentNum, state.operation);

  if (result === 'ERROR_DIV_ZERO') {
    return {
      ...state,
      display: 'Cannot divide by 0',
      expression: `${state.expression} ${formatDisplayNumber(state.display)} =`,
      previousValue: null,
      operation: null,
      overwrite: true,
      isError: true,
    };
  }

  const fullExpression = `${state.expression} ${formatDisplayNumber(state.display)} =`;

  if (addHistory) {
    addHistory({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      expression: fullExpression,
      result: result.toString(),
      timestamp: Date.now(),
    });
  }

  return {
    ...state,
    display: result.toString(),
    previousValue: null,
    operation: null,
    expression: fullExpression,
    overwrite: true,
    isError: false,
  };
}
