import Calculator from './calculator.js';


class CalculatorUI {

    // Свойства класса (константы) 
    static validDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; // валидные цифры и символы
    static binaryOperators = ['+', '-', '*', '/', '^', '%']; // валидные операторы
    static unaryOperators = ['-', '√', '∛', 'sin', 'cos', 'tan', 'lg', 'ln']; // унарные операторы
    static errorValues  = ['NaN', 'Infinity', 'undefined'];
    static parens = ['(', ')']; // скобки
    static maxInputLength = 18; // Максимальная длина ввода
    

    constructor() {
        this.calculator = new Calculator();
        this.display = document.querySelector('.display');
        this.calcButtons = document.querySelectorAll('.calc-button');
        this.radianButton = document.querySelector('#radian-degree-btn');
        this.currentInput = ''; // Текущее вводимое значение
        this.currentExpression = ''; // Выражение для вычисления
        this.isKeydownListenerActive = false;
        this.calcButtons.forEach(button => this.addButtonClickListener(button)); // Привязываем обработчики событий
        this.display.addEventListener('click', () => this.toggleKeydownListener());
    }

    parser = {

        isReverseSign: (char) => char === '±',
        isRadianSwitcher: (char) => char === 'rad' || char === 'deg',
        isDigit: (char) => CalculatorUI.validDigits.includes(char),
        isParen: (char) => CalculatorUI.parens.includes(char),  
        isClearAll: (char) => char === 'C' || char === 'Delete',
        isFactorial: (char) => char === '!' && /[\d!]$/.test(this.currentInput),
        isClearEntry: (char) => (char === 'Del' || char === "Backspace") && this.currentExpression.length > 0,
        isMaxInput: () => this.currentExpression.length > CalculatorUI.maxInputLength,
        isPoint: (char) => char === '.' && !this.currentInput.includes(char),
        isPi: (char) => char === 'π' && !/[\dπe]$/.test(this.currentInput),
        isExponent: (char) => char === 'e' && !/[πe]$/.test(this.currentInput),
        isEquals: (char) => char === '=' || char ==='Enter',

        isUnaryOperator: (char) => CalculatorUI.unaryOperators.includes(char) &&
                                          !this.currentInput.endsWith("-") &&
                                          (!this.currentInput || this.currentExpression.endsWith("(") ||
                                          CalculatorUI.binaryOperators.includes(this.currentExpression.at(-1))),
                                          
        isBinaryOperator: (char) => CalculatorUI.binaryOperators.includes(char) &&
                                           this.currentInput &&
                                           !this.currentInput.endsWith("-") &&
                                           !CalculatorUI.binaryOperators.includes(this.currentExpression.at(-1)) &&
                                           !CalculatorUI.unaryOperators.includes(this.currentExpression.at(-1)),

    }

  // Обработчик значений кнопки
    handleCalcButtonClick(value) {

        switch (true) {
            case this.parser.isClearAll(value):
                this.setExpression();
                this.updateDisplay('0');
                break;

            case this.parser.isClearEntry(value):
                let endChar = this.getEndChar(this.currentExpression);
                this.setExpression(this.currentExpression.slice(0, -endChar.length)); // Обновляем Expression
                this.updateDisplay(this.currentExpression || '0');
                break;
         
            case this.parser.isEquals(value):
                if (/[\dπe!)]$/.test(this.currentExpression)) {
                    console.log(`Выражение для вычисления: ${this.currentExpression}`);
                    let mathResult = String(this.calculator.calculate(this.currentExpression));
                    this.setExpression(mathResult);
                    this.updateDisplay(this.currentExpression);
                }
                break;

            case this.parser.isReverseSign(value):
                this.reverseSign(this.currentExpression);
                this.updateDisplay(this.currentExpression);
                break;

            case this.parser.isRadianSwitcher(value):
                this.radianButton.textContent = (this.radianButton.textContent === 'rad') ? 'deg' : 'rad';
                calculator.switchToDegrees = this.radianButton.textContent;
                break;

            case this.parser.isMaxInput(): return;

            case this.parser.isDigit(value):
            case this.parser.isPoint(value):
            case this.parser.isBinaryOperator(value):
            case this.parser.isUnaryOperator(value):
            case this.parser.isFactorial(value):
            case this.parser.isParen(value):
            case this.parser.isPi(value):
            case this.parser.isExponent(value):
    
                this.composeExpression(value);
                this.updateDisplay(this.currentExpression);
                break;
        }
    }

    // Функция для обновления дисплея
    updateDisplay(value) {
        this.display.textContent = value || '0';
    }

    getEndChar(expression) {
        
        let multiChars = [...CalculatorUI.unaryOperators, ...CalculatorUI.errorValues];
        let char = expression.at(-1);
        let multiChar = multiChars.find(char => expression.endsWith(char));
        console.log(multiChar);

        return multiChar ?? char
    }

    composeExpression(value) {
        
        if (this.parser.isBinaryOperator(value)) this.currentInput = '';
        if (value.includes('s') || value.includes('l') || value.includes('n')) value += '(';

        if (value === ')' && this.radianButton.textContent === 'deg') {
            if (/[\d.]$/.test(this.currentExpression) && !this.currentInput.includes('°')) {
                 this.composeExpression('°');
            }
        }
        this.currentInput += value;
        this.currentExpression += value;
    }

    setExpression(expression = '') {
        this.currentExpression = expression;
        this.currentInput = this.currentExpression.slice(-1);
    }

    reverseSign(expression) {
        
        if ((/^[\d.-]*$/).test(expression)) {
            if (expression.at(0) === '-') {
                this.currentExpression = expression.slice(1);
            } 
            else {
                let expressionArr = expression.split();
                expressionArr.unshift('-');
                this.currentExpression = expressionArr.join('');
            }
        }
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

}

new CalculatorUI();
