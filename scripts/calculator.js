export default class Calculator {
    
    validOperators = {
        '+': { precedence: 1, associativity: 'left' },
        '-': { precedence: 1, associativity: 'left' },
        '*': { precedence: 2, associativity: 'left' },
        '/': { precedence: 2, associativity: 'left' },
        '%': { precedence: 2, associativity: 'left' },
        '^': { precedence: 3, associativity: 'right' },
        '√': { precedence: 4, associativity: 'left' }
    };

    constructor() {
        this.stackNumbers = [];      // стек для хранения чисел (операндов)
        this.stackOperators = [];    // стек для хранения операторов
        this.currentNumber = '';     // текущее обрабатываемое число (буфер)
    }

// Основная функция калькулятора (считаем всё выражение полностью)
    calculate(expression) {
        this.parseExpression(expression); // парсим и считаем выражение
        this.pushNumberToStack(); // Добавляем последнее число из буфера
        while (this.stackOperators.length) this.applyOperator(); // Выполняем оставшиеся операции в стеке
        let result = this.stackNumbers.pop();
        return this.formatResult(result)
    }

// Если число дробное, возвращаем значение с точностью до 6 знаков, если слишком большое или маленькое с точностью до 13 знаков
    formatResult(result) {

        if (!Number.isFinite(result)) return '∞';
        if (!Number.isInteger(result)) {
            result = this.round(result, 6);
        }
        return result > 1e+13 ||
               result < -1e+13 ? 
               result.toPrecision(13) : result;
    }

// Токенизатор и сортировка (Функция парсинга символов в выражении и вычисления выражения с учетом приоритета операторов и скобок)
    parseExpression(expression) {
        
        const isDigit = (char) => /\d/.test(char);
        const isPoint = (char) => char === '.' && !this.currentNumber.includes('.');
        const isOperator = (char) => Object.hasOwn(this.validOperators, char)
        const isOpeningParenthesis = (char) => char === '(';
        const isClosingParenthesis = (char) => char === ')';
        const isConstant = (char) => char === 'π' || char === 'e';
        const isUnaryOperator = (char) => (char === '-' || char === '+') &&
                                          (this.currentNumber === '' &&
                                          (this.stackOperators.length === 0 || 
                                          isOpeningParenthesis(this.stackOperators[this.stackOperators.length - 1])));
        
        for (let char of expression) {
            if (isDigit(char) || isPoint(char) || isConstant(char) || isUnaryOperator(char)) {
                this.composeNumber(char) 
                 console.log(`Добавлено число или унарный оператор: ${this.currentNumber}`);
                }          
            else if (isOperator(char)) {
                this.pushNumberToStack();
                this.processOperatorPrecedence(char);
                this.pushOperatorToStack(char)
                console.log(`Оператор добавлен в стек: ${char}`)
            }
            
            else if (isOpeningParenthesis(char)) {
                this.pushOperatorToStack(char)
            }

            else if (isClosingParenthesis(char)) {
                this.pushNumberToStack()
                this.resolveParentheses() 
                console.log(`выражение перед: ${char} было посчитано до открывающей скобки`)
            };
        }
    }

    composeNumber(char) {
        if (char === 'π') char = Math.PI;
        if (char === 'e') char = Math.E;
        this.currentNumber += char // Строим число
        console.log(`Текущее число: ${this.currentNumber}`);
    } 


    pushOperatorToStack(operator) { 
        this.stackOperators.push(operator)
    }
    

    resolveParentheses() { 
            while (
                this.stackOperators.length &&
                this.stackOperators.at(-1) !== '('
            ) {
                this.applyOperator();
            }
    
            this.stackOperators.pop();   
    }


    pushNumberToStack() {
        if (this.currentNumber) {
            this.stackNumbers.push(parseFloat(this.currentNumber));
            this.currentNumber = '';
        }
    }

  
    processOperatorPrecedence(operator) {
        
        const { stackOperators, validOperators } = this;
        
        const operatorPrecedence = validOperators[operator].precedence;
        const isRightAssociative = validOperators[operator].associativity === 'right';

        while (stackOperators.length) {
            const lastOperator = stackOperators.at(-1);
            if (!validOperators[lastOperator]) break;
            const lastOperatorPrecedence = validOperators[lastOperator].precedence;
            
            const shouldApplyLastOperator = isRightAssociative ? lastOperatorPrecedence > operatorPrecedence
                                                               : lastOperatorPrecedence >= operatorPrecedence;
            
            if (shouldApplyLastOperator) this.applyOperator()
            else break;
        }
    }

// Функция сортировочной станции ОПЗ (вычисления выражения оператором из стека операторов и добавления полученного числа в стек чисел)
    applyOperator() {
        const { stackOperators, stackNumbers } = this;

        const currentOperator = stackOperators.pop();
        const rightOperand = stackNumbers.pop();
        const leftOperand = currentOperator !== '√' ? stackNumbers.pop() : null;
        let result = this.performMath(currentOperator, leftOperand, rightOperand);

        const ShouldKeepMinus = currentOperator === '^' &&
                              stackOperators.at(-1) === '(' &&
                              stackOperators.at(-2) !== '√' &&
                              leftOperand < 0 &&
                              rightOperand % 2 === 0;

        if (ShouldKeepMinus) { result  = -result };
        console.log(`Левый операнд: ${leftOperand}, Оператор: ${currentOperator}, Правый операнд: ${rightOperand}, Результат: ${result}`);
        stackNumbers.push(result);
    }

    round(number, decimals = 6) {
        const factor = Math.pow(10, decimals);
        return Math.round(number * factor) / factor;
    }

// Функция для выполнения одной математической операции

    performMath(operator, a, b) {
        switch (operator) {
            case '+': return this.round(a + b);
            case '-': return this.round(a - b);
            case '*': return this.round(a * b);
            case '/': return b !== 0 ? this.round(a / b) : NaN;
            case '%': return this.round(a % b);
            case '^': return this.round(Math.pow(a, b));
            case '√': return this.round(Math.sqrt(b));
            default: return b;
        }
    }
}