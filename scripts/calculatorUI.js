import Calculator from './calculator.js';

export default class CalculatorUI {

    // Константы
    static validDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    static binaryOperators = ['+', '-', '×', '÷', '^', '%'];
    static unaryOperators = ['-', '√', '∛', 'sin', 'cos', 'tan', 'cot', 'lg', 'ln'];
    static trigFunctions = ['sin', 'cos', 'tan', 'cot'];
    static errorValues  = ['NaN', 'Infinity', 'undefined'];
    static parens = ['(', ')']; 
    static maxInputLength = 18; // Максимальная длина ввода
    
    /**
     * Создает интерфейс калькулятора.
     *
     * @param {string} display - Имя класса для элемента дисплея.
     * @param {string} calcButtons - Имя класса для кнопок калькулятора.
     * @param {string} radianButton - Идентификатор кнопки переключения между радианами и градусами.
     * 
     *  @description
     * 1. Инициализирует калькулятор, создавая новый экземпляр класса Calculator.
     * 2. Находит и сохраняет элемент дисплея.
     * 3. Находит и сохраняет все кнопки калькулятора.
     * 4. Находит и сохраняет кнопку переключения между радианами и градусами.
     * 5. Инициализирует переменные для текущего ввода и текущего выражения.
     * 6. Инициализирует флаг для eventListener keydown.
     * 7. Добавляет обработчики кликов ко всем кнопкам.
     * 8. Добавляет обработчик клика на дисплей для переключения eventListener keydown.
     */

    constructor(display, calcButtons, radianButton) {
        this.calculator = new Calculator();
        this.display = document.querySelector(`.${display}`);
        this.calcButtons = document.querySelectorAll(`.${calcButtons}`);
        this.radianButton = document.querySelector(`#${radianButton}`);
        this.currentInput = '';
        this.currentExpression = '';
        this.isKeydownListenerActive = false;
        this.calcButtons.forEach(button => this.addButtonClickListener(button));
        this.display.addEventListener('click', () => this.toggleKeydownListener());
    }


    /**
     * Объект с флагами для обработки символов калькулятора.
     *
     * Эти функции-флаги используются для определения типа вводимого символа 
     * и принятия решения о том, как этот символ должен быть обработан.
     *
     * @namespace charRules
     * @property {function(string): boolean} isReverseSign
     *    Возвращает true, если переданный символ равен '±'.
     *
     * @property {function(string): boolean} isRadianSwitcher
     *    Возвращает true, если переданный символ равен 'rad' или 'deg'.
     *
     * @property {function(string): boolean} isDigit
     *    Возвращает true, если переданный символ входит в массив допустимых цифр.
     *
     * @property {function(string): boolean} isParen
     *    Возвращает true, если переданный символ входит в массив допустимых скобок.
     *
     * @property {function(string): boolean} isClearAll
     *    Возвращает true, если переданный символ равен 'C' или 'Delete'.
     *
     * @property {function(string): boolean} isFactorial
     *    Возвращает true, если переданный символ равен '!' и текущий ввод заканчивается цифрой или '!'.
     *
     * @property {function(string): boolean} isClearEntry
     *    Возвращает true, если переданный символ равен 'Del' или 'Backspace' и текущее выражение не пустое.
     *
     * @property {function(): boolean} isMaxInput
     *    Возвращает true, если длина текущего выражения превышает максимально допустимую длину.
     *
     * @property {function(string): boolean} isPoint
     *    Возвращает true, если переданный символ равен точке и в текущем вводе её ещё нет, 
     *    а также текущий ввод не заканчивается символами 'π' или 'e'.
     *
     * @property {function(string): boolean} isPi
     *    Возвращает true, если переданный символ равен 'π' и он не следует сразу за цифрой или 'π' или 'e'.
     *
     * @property {function(string): boolean} isExponent
     *    Возвращает true, если переданный символ равен 'e' и не следует сразу за 'π' или 'e'.
     *
     * @property {function(string): boolean} isEquals
     *    Возвращает true, если переданный символ равен '=' или 'Enter' и текущее выражение
     *    заканчивается на: цифру, 'π', 'e', '!', ')'.
     *
     * @property {function(string): boolean} shouldAddDegreeSign
     *    Определяет, нужно ли добавить знак градусов. Возвращает true, если переданный символ является 
     *    бинарным оператором или закрывающей скобкой, режим установлен в 'deg', текущий ввод не содержит 
     *    символ '°' и текущий ввод содержит хотя бы одну из тригонометрических функций.
     *
     * @property {function(string): boolean} isUnaryOperator
     *    Возвращает true, если переданный символ входит в массив унарных операторов,
     *    если текущий ввод не заканчивается минусом,
     *    и если удовлетворяется одно из условий:
     *    1. текущий ввод пуст, 
     *    2. если текущее выражение заканчивается открывающей скобкой,
     *    3. последний символ в текущем выражении является бинарным оператором.
     *
     * @property {function(string): boolean} isBinaryOperator
     *    Возвращает true, если переданный символ входит в массив бинарных операторов, текущий ввод не пуст, 
     *    не завершается минусом, а последний символ в текущем выражении не является ни бинарным, ни унарным оператором.
     */

    charRules = {

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
        isEquals: (char) => (char === '=' || char ==='Enter') && /[\dπe!)]$/.test(this.currentExpression),
        isPoint: (char) => char === '.' && !this.currentInput.includes(char) && !/[πe]$/.test(this.currentInput),

        shouldAddDegreeSign: (char) => {
            return (this.charRules.isBinaryOperator(char) || char === ')') &&
                    this.radianButton.textContent === 'deg' &&
                    !this.currentInput.includes('°') &&
                    CalculatorUI.trigFunctions.some(elem => this.currentInput.includes(elem))
    
        },

        isUnaryOperator: (char) => {
            return CalculatorUI.unaryOperators.includes(char) &&
                    !this.currentInput.endsWith("-") &&
                    (!this.currentInput || this.currentExpression.endsWith("(") ||
                    CalculatorUI.binaryOperators.includes(this.currentExpression.at(-1)))
          },
                                        
        isBinaryOperator: (char) => {
            return CalculatorUI.binaryOperators.includes(char) &&
                    this.currentInput &&
                    !this.currentInput.endsWith("-") &&
                    !CalculatorUI.binaryOperators.includes(this.currentExpression.at(-1)) &&
                    !CalculatorUI.unaryOperators.includes(this.currentExpression.at(-1))
          },

    }

    // Обработчики событий
    addButtonClickListener(button) {
        button.addEventListener('click', (event) => this.buttonClickHandler(event.target.textContent))
    }

    /**
     * Включает/выключает eventListener нажатий клавиатурных клавиш в поле ввода.
     * 
     * @description
     * Если eventListener включен, то при нажатии на какую-либо клавишу
     * будет вызван обработчик buttonClickHandler с соответствующим символом.
     * 
     * @property {boolean} isKeydownListenerActive
     * Если режим прослушивания включен - true, если выключен - false.
     */
    toggleKeydownListener() {
        const eventListener = this.isKeydownListenerActive ? 'removeEventListener' : 'addEventListener';
        document[eventListener]('keydown', event => this.buttonClickHandler(event.key));
        this.isKeydownListenerActive = !this.isKeydownListenerActive;
    }
    
    
    /**
     * Обрабатывает нажатия на кнопки калькулятора и выполняет соответствующие действия.
     *
     * @param {string} value - Значение кнопки, нажатой пользователем.
     *
     * @description
     * Выполняемые действия в зависимости от типа нажатой кнопки:
     * - Очистка: сбрасывает выражение (`C`) или удаляет последний вводимый символ (`Del`).
     * - Вычисление (`=`): вычисляет математическое выражение.
     * - Изменение знака (`±`): меняет знак последнего введенного числа.
     * - Переключение режима (градусы/радианы) (`rad/deg`).
     * - Ввод операторов (бинарные, унарные, скобки): добавляет их в выражение.
     * - Ввод чисел и точки.
     * - Ввод констант (`π`, `e`).
     */

    buttonClickHandler(value) {

        switch (true) {
            case this.charRules.isClearAll(value):
                this.setExpression();
                this.updateDisplay('0');
                break;

            case this.charRules.isClearEntry(value):
                let endChar = this.getEndChar(this.currentExpression);
                this.setExpression(this.currentExpression.slice(0, -endChar.length));
                this.updateDisplay(this.currentExpression || '0');
                break;
         
            case this.charRules.isEquals(value):
                console.log(`Выражение для вычисления: ${this.currentExpression}`);
                let mathResult = String(this.calculator.calculate(this.currentExpression));
                this.setExpression(mathResult);
                this.updateDisplay(this.currentExpression);
                break;

            case this.charRules.isReverseSign(value):
                this.reverseSign(this.currentInput);
                this.updateDisplay(this.currentExpression);
                break;

            case this.charRules.isRadianSwitcher(value):
                this.radianButton.textContent = (this.radianButton.textContent === 'rad') ? 'deg' : 'rad';
                this.calculator.switchRadian(this.radianButton.textContent);
                break;

            case this.charRules.isMaxInput(): return;

            case this.charRules.isBinaryOperator(value):
            case this.charRules.isUnaryOperator(value):
            case this.charRules.isParen(value):

                this.handleSpecialOperators(value);
                this.updateDisplay(this.currentExpression);
                break;

            case this.charRules.isDigit(value):
            case this.charRules.isPoint(value):
            case this.charRules.isFactorial(value):
            case this.charRules.isPi(value):
            case this.charRules.isExponent(value):
     
                this.composeExpression(value);
                this.updateDisplay(this.currentExpression);
                break;
        }
    }

    // Функция для обновления дисплея
    updateDisplay(value) {
        this.display.textContent = value || '0';
    }

    /**
     * Возвращает последний символ выражения. 
     *
     * @param {string} expression - Выражение, из которого нужно получить последний символ.  
     * @returns {string} Последний символ в выражении.
     * 
     * @description
     * Если последний символ состоит из нескольких символов (например: 'sin', 'cos', Infinity), то
     * возвращает весь символ целиком.  
     * В противном случае возвращает один последний символ. 
     */

    getEndChar(expression) {
        let multiChars = [...CalculatorUI.unaryOperators, ...CalculatorUI.errorValues];
        let char = expression.at(-1);
        let multiChar = multiChars.find(char => expression.endsWith(char));
        return multiChar ?? char
    }

    /**
     * Добавляет переданный символ к текущему вводу и текущему выражению. 
     * @param {string} value - символ, который нужно добавить к выражению.
     * @description
     * Метод добавляет символ к currentInput, currentExpression 
     */
    composeExpression(value) {
        this.currentInput += value;
        this.currentExpression += value;
    }

    /**
     * Устанавливает текущее выражение и обновляет текущий ввод.
     * @param {string} expression - Выражение, которое будет установлено как текущее.  
     *                              По умолчанию — пустая строка.
     * @description
     * Метод устанавливает текущее выражение в переданное значение.
     * Текущий ввод становится последним символом переданного выражения.
     */

    setExpression(expression = '') {
        this.currentExpression = expression;
        this.currentInput = this.currentExpression.slice(-1);
    }


    /**
     * Обрабатывает операторы с дополнительными символами.
     * @param {string} value - оператор.
     * 
     * @description
     * Если проходит проверка `shouldAddDegreeSign`, добавляет знак градуса после тригонометрической функции.  
     * Если символ является бинарным оператором, сбрасывает текущую строку ввода.  
     * Если символ является унарным оператором (кроме "-"), добавляет после него открывающую скобку.
     * В противном случае добавляет символ в текущую строку ввода.
     */

    handleSpecialOperators(value) {
      
        if (this.charRules.shouldAddDegreeSign(value)) {
            this.composeExpression('°');
        }
    
        if (this.charRules.isBinaryOperator(value)) {
            this.currentInput = '';
        }
    
        if (CalculatorUI.unaryOperators.includes(value) && value !== '-') {
            this.composeExpression(value + '('); 
            return; 
        }
    
        this.composeExpression(value);
    }

    /**
     * Инвертирует знак текущего вводимого числа.
     *
     * @param {string} input - Текущий ввод, знак которого нужно изменить.
     * 
     * @description
     * Если input оканчивается бинарным оператором, функция сразу же завершается.  
     * Если input начинается с бинарного оператора (кроме '-'), оператор удаляется из input.  
     * Если input начинается со знака "-", то он удаляется из input,
     * если наоборот, то добавляется в начало input.  
     * Затем currentInput и currentExpression обновляются с учетом изменений input.
     */

    reverseSign(input) {
        if (CalculatorUI.binaryOperators.includes(input.at(-1))) return;

        let startsWithOperator = CalculatorUI.binaryOperators.includes(input[0]) && !input.startsWith('-');

        if (startsWithOperator) input = input.slice(1);

        this.currentInput = input.startsWith('-') ? input.slice(1) : `-${input}`;
        this.currentExpression = this.currentExpression.slice(0, -input.length) + this.currentInput;
   
    }
}
