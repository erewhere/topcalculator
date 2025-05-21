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

function clearError() {
    isError = false;
    currentInput = "0";
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    shouldResetDisplay = false;
    display.textContent = currentInput;
}

function showError(message = 'ERR') {
    display.textContent = message;
    isError = true;
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

const display = document.querySelector("#display");

const digitButtons = document.querySelectorAll(".digit");
digitButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (isError) clearError();

        const digit = button.textContent;

        if (currentInput === "0" || shouldResetDisplay || justEvaluated) {
            currentInput = digit;
            shouldResetDisplay = false;
            justEvaluated = false;
        } else {
            currentInput += digit;
        }

        display.textContent = currentInput;
    });
});

const operatorButtons = document.querySelectorAll(".operator");
operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (isError) return;

        const nextOperator = getOperatorKeyword(button.textContent);
        if (!nextOperator) {
            showError();
            return;
        }

        if (justEvaluated) {
            firstOperand = currentInput;
            justEvaluated = false;
        }

        if (currentOperator && !shouldResetDisplay) {
            secondOperand = currentInput;
            const result = operate(currentOperator, Number(firstOperand), Number(secondOperand));

            if (result === 'ERR') {
                showError();
                return;
            }

            currentInput = result.toString();
            display.textContent = currentInput;
            firstOperand = currentInput;
        } else {
            firstOperand = currentInput;
        }
            
        currentOperator = nextOperator;
        shouldResetDisplay = true;
    });
});

const allClearButton = document.querySelector("#allclear");
allClearButton.addEventListener("click", clearError);

const plusMinusButton = document.querySelector("#plusminus");
plusMinusButton.addEventListener("click", () => {
    if (isError) return;
    if (currentInput === "0") return;

    currentInput = (parseFloat(currentInput) * -1).toString();
    display.textContent = currentInput;
});

const percentageButton = document.querySelector("#percentage");
percentageButton.addEventListener("click", () => {
    if (isError) return;

    currentInput = (parseFloat(currentInput) / 100).toString();
    display.textContent = currentInput;
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

        currentInput = result.toString();
        display.textContent = currentInput;
        return;
    }

    if (currentOperator === null || shouldResetDisplay) return;

    secondOperand = currentInput;
    const result = operate(currentOperator, Number(firstOperand), Number(secondOperand));

    if (result === 'ERR') {
        showError();
        return;
    }

    currentInput = result.toString();
    display.textContent = currentInput;

    lastOperator = currentOperator;
    lastSecondOperand = secondOperand;

    firstOperand = null;
    currentOperator = null;
    shouldResetDisplay = true;
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
        display.textContent = currentInput;
    }
});