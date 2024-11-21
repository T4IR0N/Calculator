import Calculator from './calculator.js';
const calculator = new Calculator();

class DOMcalculator {

    // Свойства класса
    display = document.querySelector('.display');
    calcButtons = document.querySelectorAll('.calc-button');
    validDigits = '1234567890.'; // валидные цифры и символы
    validOperators = "+-*/^%"; // валидные операторы
    unaryOperators = "√-"; // унарные операторы
    brackets = '()'; // скобки
    maxInputLength = 18; // Максимальная длина ввода

constructor() {
    this.currentInput = ''; // Текущее вводимое значение
    this.currentExpression = ''; // Выражение для вычисления
    // Привязываем обработчики событий
    this.calcButtons.forEach(button => button.addEventListener('click', () => this.handleCalcButtonClick(button))); 
}

// Функция для обновления дисплея
updateDisplay(value) {
    this.display.textContent = value || '0';
}

// Обработчик для кнопок
handleCalcButtonClick(button) {
    const value = button.textContent;
    const isDigit = (char) => this.validDigits.includes(char)
    const isBracket = (char) => this.brackets.includes(char)
    const isUnaryOperator = (char) => this.unaryOperators.includes(char) && (!this.currentInput || this.currentExpression.endsWith("("))
    const isOperator = (char) => this.validOperators.includes(char) && this.currentInput && !this.currentInput.endsWith("-")
    const isClearAll = (char) => char === 'C'
    const isClearEntry = (char) => char === 'Del' && this.currentExpression.length > 0
    const isMaxInput = () => this.currentExpression.length >= this.maxInputLength
    const isPoint = (char) => char === '.' && this.currentInput.includes(char)
    const isPI = (char) => char === 'π' && !/\d/.test(this.currentInput)
    const isEXP = (char) => char === 'e' && !/\d/.test(this.currentInput)
    const isEquals = (char) => char === '='

    switch (true) {
        case isClearAll(value):
            this.setExpression();
            this.updateDisplay('0');
            break;

        case isClearEntry(value):
            const slicedExpression = this.currentExpression.slice(0, -1);
            this.setExpression(slicedExpression); // Обновляем Expression
            this.updateDisplay(this.currentExpression || '0');
            break;

        case isMaxInput(): return;
        case isPoint(value): break;

        case isPI(value):
            this.composeExpression(Math.PI.toFixed(6)); // Добавляем значение константы
            this.updateDisplay(this.currentExpression);
            break;
        
        case isEXP(value):
            this.composeExpression(Math.E.toFixed(6)); // Добавляем значение константы
            this.updateDisplay(this.currentExpression);
            break;
        
        case isDigit(value) || isOperator(value) || isUnaryOperator(value) || isBracket(value):
            this.composeExpression(value);
            this.updateDisplay(this.currentExpression);
            if (isOperator(value)) this.currentInput = '';
            break;
        
        case isEquals(value):
            if (this.currentExpression) {
            console.log(`Выражение для вычисления: ${this.currentExpression}`);
            let mathResult = String(calculator.calculate(this.currentExpression));
            this.setExpression(mathResult);
            this.updateDisplay(this.currentExpression);
            }
            break;
    
   /*      case isUnaryOperator(value):
            this.composeExpression(value);
            this.updateDisplay(this.currentExpression);
            break; */

        /* case isOperator(value):
            this.composeExpression(value)
            this.updateDisplay(this.currentExpression);
            this.currentInput = '';
            break; */
        }
}

composeExpression(value) {
    this.currentInput += value;
    this.currentExpression += value;
}

setExpression(input = '') {
    this.currentInput = input;
    this.currentExpression = input;
}

}



new DOMcalculator();
