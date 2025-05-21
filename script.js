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
        case '*': return 'multiply';
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
            return 'ERR: Unknown Operator';
    }
}

let currentInput = "0";
let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let shouldResetDisplay = false;
let isError = false;

const display = document.querySelector("#display");

const digitButtons = document.querySelectorAll(".digit");

digitButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (isError) return;

        const digit = button.textContent;

        if (currentInput === "0" || shouldResetDisplay) {
            currentInput = digit;
            shouldResetDisplay = false;
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

        if (currentOperator !== null && !shouldResetDisplay) {
            secondOperand = currentInput;
            const result = operate(currentOperator, Number(firstOperand), Number(secondOperand));

            if (result === 'ERR') {
                display.textContent = 'ERR';
                isError = true;
                return;
            }

            display.textContent = result;
            firstOperand = display.textContent;
        } else {
            firstOperand = currentInput;
        }

        currentOperator = getOperatorKeyword(button.textContent);
        shouldResetDisplay = true;
    });
});

const allClearButton = document.querySelector("#allclear");

allClearButton.addEventListener("click", () => {
    currentInput = "0";
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    shouldResetDisplay = false;
    isError = false;
    display.textContent = currentInput;
});

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

    if (currentOperator === null || shouldResetDisplay) return;

    secondOperand = currentInput;
    const result = operate(currentOperator, Number(firstOperand), Number(secondOperand));

    if (result === 'ERR') {
        display.textContent = 'ERR';
        isError = true;
        return;
    }

    display.textContent = result;
    currentInput = result;
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