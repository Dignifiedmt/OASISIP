const state = {
    currentValue: '0',
    previousValue: null,
    operator: null,
    waitingForNext: false,
    expression: '',
    justEvaluated: false,
    isBaseMode: false
};

// ============================================================
// DOM REFS
// ============================================================
const exprEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const allBtns = document.querySelectorAll('.btn');

// ============================================================
// RENDER
// ============================================================
function updateDisplay() {
    let displayVal = state.currentValue;

    if (displayVal.length > 14 && displayVal !== 'Error') {
        const num = parseFloat(displayVal);
        if (!isNaN(num)) displayVal = num.toExponential(6);
        else displayVal = displayVal.slice(0, 14) + '…';
    }

    resultEl.textContent = displayVal;
    resultEl.classList.toggle('shrink', displayVal.length > 10);
    exprEl.textContent = state.expression;

    if (state.isBaseMode && !state.expression) {
        exprEl.textContent = '🔢 Enter a positive integer';
    }
}

// ============================================================
// SAFETY RESET (Called when 'Error' is detected)
// ============================================================
function resetFromError() {
    if (state.currentValue === 'Error') {
        state.currentValue = '0';
        state.expression = '';
        state.operator = null;
        state.previousValue = null;
        state.waitingForNext = false;
        state.justEvaluated = false;
        if (state.isBaseMode) state.isBaseMode = false;
    }
}

// ============================================================
// INPUT DIGIT (FIX: handle waitingForNext)
// ============================================================
function inputDigit(digit) {
    if (state.currentValue === 'Error') {
        clearAll();
    }

    // If we just evaluated, start fresh
    if (state.justEvaluated) {
        state.currentValue = '0';
        state.justEvaluated = false;
        state.expression = '';
    }

    // If waiting for next number (after an operator), start fresh
    if (state.waitingForNext) {
        state.currentValue = '0';
        state.waitingForNext = false;
    }

    if (state.isBaseMode && digit === '.') return;

    if (state.currentValue === '0' && digit !== '.') {
        state.currentValue = digit;
    } else {
        if (state.currentValue.replace('-', '').replace('.', '').length >= 15) return;
        state.currentValue += digit;
    }
    updateDisplay();
}

// ============================================================
// INPUT DECIMAL (FIX: handle waitingForNext)
// ============================================================
function inputDecimal() {
    if (state.currentValue === 'Error') {
        clearAll();
    }

    if (state.justEvaluated) {
        state.currentValue = '0.';
        state.justEvaluated = false;
        state.expression = '';
        updateDisplay();
        return;
    }

    // If waiting for next number, start with "0."
    if (state.waitingForNext) {
        state.currentValue = '0.';
        state.waitingForNext = false;
        updateDisplay();
        return;
    }

    if (state.currentValue.includes('.')) return;
    state.currentValue += '.';
    updateDisplay();
}

// ============================================================
// COMPUTE ENGINE
// ============================================================
function compute(a, op, b) {
    switch (op) {
        case '+':
            return a + b;
        case '−':
            return a - b;
        case '×':
            return a * b;
        case '÷':
            if (b === 0) return 'Error';
            return a / b;
        default:
            return b;
    }
}

// ============================================================
// OPERATOR HANDLER (Fixed Chaining)
// ============================================================
function handleOperator(nextOp) {
    if (state.currentValue === 'Error') {
        clearAll();
    }

    if (state.isBaseMode) exitBaseMode();

    const currentNum = parseFloat(state.currentValue);

    if (state.justEvaluated) {
        state.previousValue = currentNum;
        state.justEvaluated = false;
    }

    if (state.operator && !state.waitingForNext && !state.justEvaluated) {
        const result = compute(state.previousValue, state.operator, currentNum);
        if (result === 'Error') {
            state.currentValue = 'Error';
            state.expression = `${state.previousValue} ${state.operator} ${currentNum} = ❌`;
            state.operator = null;
            state.previousValue = null;
            state.waitingForNext = false;
            updateDisplay();
            return;
        }
        state.currentValue = String(result);
        state.previousValue = result;
    } else {
        state.previousValue = currentNum;
    }

    state.operator = nextOp;
    state.waitingForNext = true;
    state.justEvaluated = false;
    state.expression = `${state.currentValue} ${nextOp}`;
    updateDisplay();
}

// ============================================================
// EQUALS (Fixed the 'waitingForNext' bug)
// ============================================================
function handleEquals() {
    if (state.currentValue === 'Error') {
        clearAll();
        return;
    }

    if (state.isBaseMode) {
        performBaseConversion();
        return;
    }

    const currentNum = parseFloat(state.currentValue);

    // Case: pressing = right after an operator (e.g., "5 + =")
    if (state.waitingForNext) {
        state.expression = `${state.currentValue} =`;
        state.justEvaluated = true;
        state.operator = null;
        state.previousValue = null;
        state.waitingForNext = false; // reset
        updateDisplay();
        return;
    }

    if (!state.operator) {
        state.expression = `${state.currentValue} =`;
        state.justEvaluated = true;
        updateDisplay();
        return;
    }

    const result = compute(state.previousValue, state.operator, currentNum);
    if (result === 'Error') {
        state.currentValue = 'Error';
        state.expression = `${state.previousValue} ${state.operator} ${state.currentValue} = ❌`;
        state.operator = null;
        state.previousValue = null;
        state.waitingForNext = false;
        state.justEvaluated = true;
        updateDisplay();
        return;
    }

    state.expression = `${state.previousValue} ${state.operator} ${state.currentValue} =`;
    state.currentValue = String(result);
    state.previousValue = null;
    state.operator = null;
    state.waitingForNext = false;
    state.justEvaluated = true;
    updateDisplay();
}

// ============================================================
// CLEAR & BACKSPACE
// ============================================================
function clearAll() {
    if (state.isBaseMode) exitBaseMode();
    state.currentValue = '0';
    state.previousValue = null;
    state.operator = null;
    state.waitingForNext = false;
    state.expression = '';
    state.justEvaluated = false;
    updateDisplay();
}

function handleBackspace() {
    if (state.currentValue === 'Error') {
        clearAll();
        return;
    }

    if (state.isBaseMode) {
        if (state.currentValue.length > 1) state.currentValue = state.currentValue.slice(0, -1);
        else state.currentValue = '0';
        updateDisplay();
        return;
    }

    if (state.justEvaluated || state.waitingForNext) {
        // If waiting for next number, backspace should clear the new number (which is still '0' or the last entered)
        // But we'll just reset to '0' and clear waiting flag
        state.currentValue = '0';
        state.waitingForNext = false;
        state.justEvaluated = false;
        updateDisplay();
        return;
    }

    if (state.currentValue.length > 1) state.currentValue = state.currentValue.slice(0, -1);
    else state.currentValue = '0';
    updateDisplay();
}

// ============================================================
// SIGN TOGGLE (±)
// ============================================================
function toggleSign() {
    if (state.currentValue === 'Error') {
        clearAll();
        return;
    }
    if (state.isBaseMode) exitBaseMode();

    if (state.currentValue === '0') return;
    if (state.currentValue.startsWith('-')) {
        state.currentValue = state.currentValue.slice(1);
    } else {
        state.currentValue = '-' + state.currentValue;
    }
    updateDisplay();
}

// ============================================================
// SQUARE & SQUARE ROOT
// ============================================================
function applySquare() {
    if (state.currentValue === 'Error') {
        clearAll();
        return;
    }
    if (state.isBaseMode) exitBaseMode();

    const num = parseFloat(state.currentValue);
    if (isNaN(num)) {
        state.currentValue = 'Error';
        updateDisplay();
        return;
    }
    state.expression = `sqr(${state.currentValue}) =`;
    state.currentValue = String(num * num);
    state.justEvaluated = true;
    state.operator = null;
    state.previousValue = null;
    state.waitingForNext = false;
    updateDisplay();
}

function applySqrt() {
    if (state.currentValue === 'Error') {
        clearAll();
        return;
    }
    if (state.isBaseMode) exitBaseMode();

    const num = parseFloat(state.currentValue);
    if (isNaN(num) || num < 0) {
        state.currentValue = 'Error';
        state.expression = `√(${state.currentValue}) = ❌`;
        updateDisplay();
        return;
    }
    state.expression = `√(${state.currentValue}) =`;
    state.currentValue = String(Math.sqrt(num));
    state.justEvaluated = true;
    state.operator = null;
    state.previousValue = null;
    state.waitingForNext = false;
    updateDisplay();
}

// ============================================================
// BASE CONVERTER
// ============================================================
function toggleBaseMode() {
    if (state.currentValue === 'Error') {
        clearAll();
        return;
    }
    state.isBaseMode ? exitBaseMode() : enterBaseMode();
}

function enterBaseMode() {
    state.isBaseMode = true;
    state.currentValue = '0';
    state.expression = '';
    state.previousValue = null;
    state.operator = null;
    state.waitingForNext = false;
    state.justEvaluated = false;
    updateDisplay();
}

function exitBaseMode() {
    state.isBaseMode = false;
    state.currentValue = '0';
    state.expression = '';
    state.previousValue = null;
    state.operator = null;
    state.waitingForNext = false;
    state.justEvaluated = false;
    updateDisplay();
}

function performBaseConversion() {
    const input = state.currentValue.trim();
    // Accept only non-negative integers (no sign, no decimal)
    if (!/^\d+$/.test(input)) {
        state.expression = '⚠️ Enter a positive integer';
        updateDisplay();
        return;
    }
    const decimal = parseInt(input, 10);
    if (isNaN(decimal) || decimal < 0) {
        state.expression = '⚠️ Positive integers only';
        updateDisplay();
        return;
    }
    state.currentValue = `DEC: ${decimal}`;
    state.expression = `BIN: ${decimal.toString(2)}  |  OCT: ${decimal.toString(8)}  |  HEX: ${decimal.toString(16).toUpperCase()}`;
    state.justEvaluated = true;
    updateDisplay();
}

// ============================================================
// EVENT BINDING (No inline onclick)
// ============================================================
allBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const val = btn.dataset.value;
        const action = btn.dataset.action;

        if (btn.classList.contains('btn-number') && val !== undefined) {
            if (val === '.') { inputDecimal(); return; }
            inputDigit(val);
            return;
        }

        if (btn.classList.contains('btn-operator')) {
            handleOperator(val);
            return;
        }

        switch (action) {
            case 'equals':
                handleEquals();
                break;
            case 'clear':
                clearAll();
                break;
            case 'backspace':
                handleBackspace();
                break;
            case 'toggleSign':
                toggleSign();
                break;
            case 'sqrt':
                applySqrt();
                break;
            case 'square':
                applySquare();
                break;
            case 'base':
                toggleBaseMode();
                break;
            default:
                break;
        }
    });
});

// ============================================================
// KEYBOARD SUPPORT
// ============================================================
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9') {
        inputDigit(key);
        e.preventDefault();
    } else if (key === '.') {
        inputDecimal();
        e.preventDefault();
    } else if (key === 'Enter' || key === '=') {
        handleEquals();
        e.preventDefault();
    } else if (key === 'Backspace') {
        handleBackspace();
        e.preventDefault();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
        e.preventDefault();
    } else if (key === '+') {
        handleOperator('+');
        e.preventDefault();
    } else if (key === '-') {
        handleOperator('−');
        e.preventDefault();
    } else if (key === '*') {
        handleOperator('×');
        e.preventDefault();
    } else if (key === '/') {
        handleOperator('÷');
        e.preventDefault();
    }
});

// ============================================================
// START
// ============================================================
updateDisplay();