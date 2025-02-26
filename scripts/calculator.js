import Parser from './parser';

export default class Calculator {
    
    validOperators = {
        '+':   { precedence: 1, associativity: 'left' },
        '-':   { precedence: 1, associativity: 'left' },
        '*':   { precedence: 2, associativity: 'left' },
        '/':   { precedence: 2, associativity: 'left' },
        '%':   { precedence: 2, associativity: 'left' },
        '^':   { precedence: 3, associativity: 'right' },
        '√':   { precedence: 4, associativity: null },
        '∛':   { precedence: 4, associativity: null },
        '!':   { precedence: 4, associativity: null },
        'lg':  { precedence: 4, associativity: null },
        'ln':  { precedence: 4, associativity: null },
        'sin': { precedence: 4, associativity: null },
        'cos': { precedence: 4, associativity: null },
        'tan': { precedence: 4, associativity: null },
    };

    constructor() {
        this.parser = new Parser()
        this.stackNumbers = [];      // стек для хранения чисел (операндов)
        this.stackOperators = [];    // стек для хранения операторов
        this.currentNumber = '';    //  // текущее обрабатываемое число (буфер) 
        
        this.isRadian = true;
    }


    set switchToDegrees(value) {
        this.isRadian = value === 'rad';
    }
    

// Основная функция калькулятора (считаем всё выражение полностью)
    calculate(expression) {
        const tokenizedExpression = this.parser.tokenize(expression);
        const postfixExpression = this.parser.parseToPostfix(tokenizedExpression);
        return this.applyOperators(postfixExpression);
    }

    applyOperators(expression) {
        const stack = [];
        for (const token of expression) {
            if (typeof token === 'number') {
                stack.push(token);
            } else {
                const rightOperand = stack.pop();
                const leftOperand = this.parser.validOperators[token].associativity !== null ? stack.pop() : null;
                const result = this.performMath(token, leftOperand, rightOperand);
                stack.push(result);
            }
        }
        console.log(`Функция evaluatePostfix , stack: ${stack}`);
        return this.formatResult(stack.pop());
    
}

// Если число дробное, возвращаем значение с точностью до 6 знаков, если слишком большое или маленькое с точностью до 13 знаков
    formatResult(result) {

        if (!Number.isFinite(result)) return result;
        if (!Number.isInteger(result)) {
            result = result.toFixed(6);
        }
        return result > 1e+13 || result < -1e+13 ? 
            parseFloat(result.toPrecision(13)) :
            parseFloat(result);
    }

// Функция для выполнения одной математической операции

    performMath(operator, a, b) {

        const factorial = (n) => { 
            if (!Number.isInteger(n) || n < 0) return NaN; 
            else if (n > 2) return n * factorial(n - 1)
            else return n;   
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
            case '∛':
                return (Math.cbrt(b));
            case '!':
                return factorial(b);
            case 'lg':
                return (Math.log10(b));
            case 'ln':
                return (Math.log(b));
            case 'sin':
                return this.isRadian ? (Math.sin(b)) : Math.sin(b * Math.PI / 180);
            case 'cos':
                return this.isRadian ? (Math.cos(b)) : Math.cos(b * Math.PI / 180);
            case 'tan':
                return this.isRadian ? (Math.tan(b)) : Math.tan(b * Math.PI / 180);
        
            default: return b;
        }
    }
}