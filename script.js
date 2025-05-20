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
let firstValue = '';
let operator = '';
let secondValue = '';
let currentInput = "0";

const display = document.querySelector("#display");
const digitButtons = document.querySelectorAll(".digit");

digitButtons.forEach(button => {
    button.addEventListener("click", () => {
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

let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let shouldResetDisplay = false;

const operatorButtons = document.querySelectorAll(".operator");

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (currentOperator !== null && !shouldResetDisplay) {
            secondOperand = currentInput;
            display.textContent = operate(currentOperator, Number(firstOperand), Number(secondOperand));
            firstOperand = display.textContent;
        } else {
            firstOperand = currentInput;
        }

        currentOperator = getOperatorKeyword(button.textContent);
        shouldResetDisplay = true;
    });
});