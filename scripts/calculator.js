export default class Calculator {
    
    validOperators = {
        '+':   { precedence: 1, associativity: 'left' },
        '-':   { precedence: 1, associativity: 'left' },
        '*':   { precedence: 2, associativity: 'left' },
        '/':   { precedence: 2, associativity: 'left' },
        '%':   { precedence: 2, associativity: 'left' },
        '^':   { precedence: 3, associativity: 'right' },
        '√':   { precedence: 4, associativity: false },
        '!':   { precedence: 4, associativity: false },
        'lg':  { precedence: 4, associativity: false },
        'ln':  { precedence: 4, associativity: false },
        'sin': { precedence: 4, associativity: false },
        'cos': { precedence: 4, associativity: false },
    };

    constructor() {
        this.stackNumbers = [];      // стек для хранения чисел (операндов)
        this.stackOperators = [];    // стек для хранения операторов
        this.currentNumber = '';    //  // текущее обрабатываемое число (буфер) 
    }

// Основная функция калькулятора (считаем всё выражение полностью)
    calculate(expression) {
        const tokenizedExpression = this.tokenize(expression) // Тоекнизируем выражение (каждый токен записывается в массив)
        this.parseExpression(tokenizedExpression); // парсим и считаем выражение
        this.pushNumberToStack(); // Добавляем последнее число из буфера
        while (this.stackOperators.length) this.applyOperator(); // Выполняем оставшиеся операции в стеке
        let result = this.stackNumbers.pop();
        return this.formatResult(result)
    }

// Если число дробное, возвращаем значение с точностью до 6 знаков, если слишком большое или маленькое с точностью до 13 знаков
    formatResult(result) {

        if (!Number.isFinite(result)) return '∞';
        if (!Number.isInteger(result)) {
            result = result.toFixed(6);
        }
        return result > 1e+13 || result < -1e+13 ? 
               parseFloat(result.toPrecision(13)) :
               parseFloat(result);
    }


    tokenize(expression) {
        return expression.match(/\d|lg|ln|sin|cos|[πe+\-*/^%!().]/g)
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
                                          (!this.stackOperators.length || 
                                          isOpeningParenthesis(this.stackOperators.at(-1))));
        
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
        const leftOperand = this.validOperators[currentOperator].associativity ?
                            stackNumbers.pop() : null;
                
        const result = this.performMath(currentOperator, leftOperand, rightOperand)
        const formattedResult = this.formatResult(result);        
        const finalResult = this.keepMinusAfterPower(currentOperator, leftOperand, rightOperand, formattedResult);

        console.log(`Левый операнд: ${leftOperand}, Оператор: ${currentOperator}, Правый операнд: ${rightOperand}, Результат: ${finalResult}`);
        stackNumbers.push(finalResult);
    }


    keepMinusAfterPower(operator, a, b, result) {
        if (operator === '^' &&
            this.stackOperators.at(-1) === '(' &&
            this.stackOperators.at(-2) !== '√' &&
            a < 0 &&
            b % 2 === 0) return -result;

        else return result
    }

// Функция для выполнения одной математической операции

    performMath(operator, a, b) {

        const factorial = (n) => { 
            if (!Number.isInteger(n) || n < 0) return NaN; 
            else if (n > 1) return n * factorial(n - 1)
            else return 1;   
        }
        
        switch (operator) {
            case '+':
                return (a + b);
            case '-':
                return (a - b);
            case '*':
                return (a * b);
            case '/':
                return b !== 0 ? (a / b) : NaN;
            case '%':
                return (a % b);
            case '^':
                return (Math.pow(a, b));
            case '√':
                return (Math.sqrt(b));
            case '!':
                return factorial(b);
            case 'lg':
                return (Math.log10(b));
            case 'ln':
                return (Math.log(b));
            case 'sin':
                return (Math.sin(b));
            case 'cos':
                return (Math.cos(b));
        
            default: return b;
        }
    }
}