import Calculator from './calculator.js';
const calculator = new Calculator();

class CalculatorUI {

    // Свойства класса (константы) 
    static validDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']; // валидные цифры и символы
    static binaryOperators = ['+', '-', '*', '/', '^', '%']; // валидные операторы
    static unaryOperators = ['-', '√', '!', 'sin', 'cos', 'lg', 'ln']; // унарные операторы
    static constants = ['π', 'e']
    static parens = ['(', ')']; // скобки
    static maxInputLength = 18; // Максимальная длина ввода
    

    constructor() {
        this.display = document.querySelector('.display');
        this.calcButtons = document.querySelectorAll('.calc-button');
        this.currentInput = ''; // Текущее вводимое значение
        this.currentExpression = ''; // Выражение для вычисления
        this.isKeydownListenerActive = false
        // Привязываем обработчики событий
        this.calcButtons.forEach(button => this.addButtonClickListener(button));
        this.display.addEventListener('click', () => this.toggleKeydownListener())
    }

    // Обработчики событий
    addButtonClickListener(button) {
        button.addEventListener('click', (event) => this.handleCalcButtonClick(event.target.textContent))
    }

    handleKeydownEvent = (event) => {
        this.handleCalcButtonClick(event.key);
    };

    toggleKeydownListener() {
        if (!this.isKeydownListenerActive) {
            document.addEventListener('keydown', this.handleKeydownEvent); 
        } else {
            document.removeEventListener('keydown', this.handleKeydownEvent);
        }
        this.isKeydownListenerActive = !this.isKeydownListenerActive; // Переключаем состояние
    }

    // Функция для обновления дисплея
    updateDisplay(value) {
        this.display.textContent = value || '0';
    }

    // Обработчик значений кнопки
    handleCalcButtonClick(value) {

        const isDigit = (char) => CalculatorUI.validDigits.includes(char);
        const isParen = (char) => CalculatorUI.parens.includes(char);

        const isUnaryOperator = (char) => CalculatorUI.unaryOperators.includes(char) &&
                                        (!this.currentInput || this.currentExpression.endsWith("("));

        const isOperator = (char) => CalculatorUI.binaryOperators.includes(char) &&
                                    this.currentInput && !this.currentInput.endsWith("-");
        
        const isClearAll = (char) => char === 'C' || char === 'Delete';
        const isClearEntry = (char) => (char === 'Del' || char === "Backspace") && this.currentExpression.length > 0;
        const isMaxInput = () => this.currentExpression.length > CalculatorUI.maxInputLength;
        const isSecondPoint = (char) => char === '.' && this.currentInput.includes(char);
        const isConstant = (char) => CalculatorUI.constants.includes(char) && !/[\dπe]$/.test(this.currentInput);
        const isEquals = (char) => char === '=' || char ==='Enter';

        switch (true) {
            case isClearAll(value):
                this.setExpression();
                this.updateDisplay('0');
                break;

            case isClearEntry(value):
                let endChar = this.getEndChar(this.currentExpression);
                this.setExpression(this.currentExpression.slice(0, -endChar.length)); // Обновляем Expression
                this.updateDisplay(this.currentExpression || '0');
                break;

            case isMaxInput(): return;

            case isSecondPoint(value): break;
    
            case isDigit(value):
            case isOperator(value):
            case isUnaryOperator(value):
            case isConstant(value):
            case isParen(value):
                
                if (isOperator(value)) this.currentInput = '';
                console.log(`Инпут: ${this.currentInput }`);
                this.composeExpression(value);
                this.updateDisplay(this.currentExpression);
                break;
            
            case isEquals(value):
                if (this.currentExpression) {
                console.log(`Выражение для вычисления: ${this.currentExpression}`);
                let mathResult = String(calculator.calculate(this.currentExpression));
                this.setExpression(mathResult);
                this.updateDisplay(this.currentExpression);
                }
                break;

        }
    }

    getEndChar(expression) {
        
        let validChars = [ ...CalculatorUI.validDigits, ...CalculatorUI.binaryOperators,
                        ...CalculatorUI.unaryOperators, ...CalculatorUI.constants, ...CalculatorUI.parens ]

        let char = validChars.find(char => expression.endsWith(char));
        return char ?? 'NaN'
    }

    composeExpression(value) {
        if (CalculatorUI.unaryOperators.includes(value) && value !== '-') value += '('
        this.currentInput += value;
        this.currentExpression += value;
    }

    setExpression(input = '') {
        this.currentInput = input;
        this.currentExpression = input;
    }

}

new CalculatorUI();
