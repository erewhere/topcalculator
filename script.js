function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return a / b;
}

function getOperatorKeyword(symbol) {
    switch (symbol) {
        case '+': return 'add';
        case '-': return 'subtract';
        case 'x': return 'multiply';
        case '/': return 'divide';
        default: return null;
    }
}

function operate(operator, a, b) {
    switch (operator) {
        case 'add':
            return add(a, b);
        case 'subtract':
            return subtract(a, b);
        case 'multiply':
            return multiply(a, b);
        case 'divide':
            return b===0 ? 'ERR' : divide(a, b);
        default:
            return 'ERR';
    }
}

function roundResult(result) {
    return Math.round(result * 100000) / 100000;
}

function clearError() {
    isError = false;
    currentInput = "0";
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    currentOperatorSymbol = null;
    shouldResetDisplay = false;
    justEvaluated = false;
    lastOperator = null;
    lastSecondOperand = null;
    isInputting = true;
    mainOutput.textContent = currentInput;
    operationDisplay.textContent = "";
    updateAllClearButton();
}

function showError(message = 'ERR') {
    mainOutput.textContent = message;
    operationDisplay.textContent = "";
    isError = true;
    currentInput = "0";
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    currentOperatorSymbol = null;
    justEvaluated = false;
    lastOperator = null;
    lastSecondOperand = null;
    shouldResetDisplay = true;
    isInputting = false;
    updateAllClearButton();
}

function updateAllClearButton() {
    if (currentInput === '0' || !isInputting) {
        allclearBtn.textContent = 'AC';
        allclearBtn.classList.remove('danger');
    } else {
        allclearBtn.textContent = 'DEL';
        allclearBtn.classList.add('danger');
    }
}

let currentInput = "0";
let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let shouldResetDisplay = false;
let isError = false;
let justEvaluated = false;
let lastOperator = null;
let lastSecondOperand = null;
let isInputting = true;
let currentOperatorSymbol = null;

const display = document.querySelector("#display");
const operationDisplay = document.querySelector("#operation");
const mainOutput = document.querySelector("#main-output");

const digitButtons = document.querySelectorAll(".digit");
digitButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (isError) clearError();

        const digit = button.textContent;

        if (currentInput === "0" || shouldResetDisplay || justEvaluated) {
            currentInput = digit;
            shouldResetDisplay = false;

            if (justEvaluated) {
                operationDisplay.textContent = '';
            }

            justEvaluated = false;

        } else {
            currentInput += digit;
        }

        isInputting = true;
        mainOutput.textContent = currentInput;
        updateAllClearButton();

        if (currentOperatorSymbol && firstOperand !== null) {
            operationDisplay.textContent = `${firstOperand} ${currentOperatorSymbol} ${currentInput}`;
        } else {
            operationDisplay.textContent = currentInput;
        }
    });
});

const operatorButtons = document.querySelectorAll(".operator");
operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (isError) return;

        const symbol = button.textContent;
        const nextOperator = getOperatorKeyword(symbol);
        if (!nextOperator) {
            showError();
            return;
        }

        if (justEvaluated) {
            firstOperand = Number(currentInput);
            justEvaluated = false;
        }

        if (currentOperator && !shouldResetDisplay) {
            secondOperand = currentInput;

            if (currentOperator === 'divide' && Number(secondOperand) === 0) {
                showError();
                return;
            }

            const result = operate(currentOperator, Number(firstOperand), Number(secondOperand));
            if (result === 'ERR' || result === Infinity || isNaN(result)) {
                showError();
                return;
            }

            currentInput = roundResult(result).toString();
            mainOutput.textContent = currentInput;
            firstOperand = Number(currentInput);
        } else {
            firstOperand = Number(currentInput);
        }
            
        currentOperator = nextOperator;
        currentOperatorSymbol = symbol;
        shouldResetDisplay = true;
        isInputting = false;

        operationDisplay.textContent = `${firstOperand} ${currentOperatorSymbol}`;
        updateAllClearButton();
    });
});

const allclearBtn = document.querySelector("#allclear");
allclearBtn.addEventListener('click', () => {
    if (isInputting && currentInput !== "0") {
            currentInput = currentInput.slice(0, -1) || '';
            mainOutput.textContent = currentInput || '0';

            if (currentInput === '') {
                operationDisplay.textContent = '';

            } else if (currentOperatorSymbol && firstOperand !== null) {
                operationDisplay.textContent = `${firstOperand} ${currentOperatorSymbol} ${currentInput}`;
            } else {
                operationDisplay.textContent = currentInput;    
            }        
        } else {
            clearError();
        }
            updateAllClearButton();
});

const plusMinusButton = document.querySelector("#plusminus");
plusMinusButton.addEventListener("click", () => {
    if (isError || currentInput === "0") return;
    currentInput = (parseFloat(currentInput) * -1).toString();
    mainOutput.textContent = currentInput;
    updateAllClearButton();
});

const percentageButton = document.querySelector("#percentage");
percentageButton.addEventListener("click", () => {
    if (isError) return;
    currentInput = (parseFloat(currentInput) / 100).toString();
    mainOutput.textContent = currentInput;
    updateAllClearButton();
});

const equalsButton = document.querySelector("#equals");
equalsButton.addEventListener("click", () => {
    if (isError) return;

    if (currentOperator === null) {
        if (!lastOperator || !lastSecondOperand) return;

        const result = operate(lastOperator, Number(currentInput), Number(lastSecondOperand));
        if (result === 'ERR') {
            showError();
            return;
        }

        currentInput = roundResult(result).toString();
        mainOutput.textContent = currentInput;
        justEvaluated = true;
        updateAllClearButton();
        return;
    }

    if (shouldResetDisplay) return;

    secondOperand = currentInput;

    if (currentOperator === 'divide' && Number(secondOperand) === 0) {
        showError();
        return;
    }

    const result = operate(currentOperator, Number(firstOperand), Number(secondOperand));
    if (result === 'ERR' || result === Infinity || isNaN(result)) {
        showError();
        return;
    }

    currentInput = roundResult(result).toString();
    mainOutput.textContent = currentInput;

    operationDisplay.textContent = `${firstOperand} ${currentOperatorSymbol} ${secondOperand} =`;

    lastOperator = currentOperator;
    lastSecondOperand = secondOperand;

    firstOperand = null;
    currentOperator = null;
    shouldResetDisplay = true;
    isInputting = false;
    justEvaluated = true;
    updateAllClearButton();
});

const decimalButton = document.querySelector("#decimal");
decimalButton.addEventListener("click", () => {
    if (isError) return;

    if (shouldResetDisplay) {
        currentInput = "0";
        shouldResetDisplay = false;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
        mainOutput.textContent = currentInput;
        updateAllClearButton();
    }
});

document.addEventListener("keydown", (e) => {
    if (isError && e.key !== "Escape") return;

    const key = e.key;

    if (!isNaN(key)) {
        document.querySelector(`.digit[data-key="${key}"]`)?.click();
    } else if (key === ".") {
        decimalButton.click();
    } else if (["+", "-", "*", "/"].includes(key)) {
        let symbol = key === "*" ? "x" : key;
        document.querySelector(`.operator[data-key="${symbol}"]`)?.click();
    } else if (key === "Enter" || key === "=") {
        equalsButton.click();
    } else if (key === "Backspace") {
        allclearBtn.click();
    } else if (key.toLowerCase() === "c" || key === "Escape") {
        clearError();
    } else if (key === "%") {
        percentageButton.click();
    } else if (key === "`") {
        plusMinusButton.click();
    }
});