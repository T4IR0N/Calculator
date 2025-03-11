import Parser from './parser.js'

export default class Calculator {
    
    constructor() {
        this.parser = new Parser();
        this.isRadian = true;
    }

    switchRadian(value) {
        this.isRadian = (value === 'rad');
    }
    

    calculate(expression) {
        const tokenizedExpression = this.parser.tokenize(expression);
        const postfixExpression = this.parser.parseToPostfix(tokenizedExpression);
        const result = this.applyOperators(postfixExpression);
        const formattedResult = this.formatResult(result);
        return formattedResult
    }


    /**
     * Применяет операторы постфиксного выражения для вычисления результата.
     *
     * @param {Array<number|string>} postfixExpression - Постфиксное выражение для вычисления.
     * @returns {number|string} Отформатированный результат вычисления.
     *
     * @description
     * Итеративно проходит по постфиксному выражению.
     * Если встречается число, то оно помещается в стек для хранения операндов.
     * Если встречается оператор, извлекает операнды из стека,
     * выполняет математическую операцию и помещает результат обратно в стек.  
     * В конце возвращает отформатированный результат, оставшийся в стеке.
     */

    applyOperators(postfixExpression) {
        const numberStack = [];
        for (const token of postfixExpression) {
            if (typeof token === 'number') {
                numberStack.push(token);
            } else {
                const rightOperand = numberStack.pop();
                const leftOperand = (Parser.validOperators[token]?.associativity) ? numberStack.pop() : null;
                const result = this.performMath(token, leftOperand, rightOperand);
                numberStack.push(result);
            }
        }
        console.log(`Полученный результат ${numberStack}`);
        return numberStack.pop();
    
}


    /**
     * Форматирует результат вычисления.
     *
     * @param {number|string} result - Результат вычисления.
     * @returns {number|string} Отформатированный результат вычисления.
     *
     * @description
     * 1) Если результат не является числом, то возвращает его как есть.
     * 2) Если результат является дробным числом, то результат округляется с точностью до 9 знаков.
     * 3) Возвращает результат:
     * - если его модуль более 1e+13, в виде числа с точностью до 13 знаков,
     * - иначе в виде числа как есть.
     */
    
    formatResult(result) {

        if (!Number.isFinite(result)) return result;
        if (!Number.isInteger(result)) {
            result = result.toFixed(9);
        }
        return (Math.abs(result) > 1e+13) ? parseFloat(result.toPrecision(13)) :
                                            parseFloat(result);
    }

    /**
     * Выполняет математическую операцию.
     *
     * @param {string} operator - Оператор.
     * @param {number} a - Левый операнд.
     * @param {number} b - Правый операнд.
     * @returns {number} Результат математической операции.
     *
     * @description
     * С помощью switch находит соответсвующую оператору математическую операцию и возвращает её результат.
     */
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
            case '×':
                return (a * b);
            case '÷':
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
            case 'cot':
                return this.isRadian ? (1 / (Math.tan(b))) : (1 / Math.tan(b * Math.PI / 180));
        
            default: return b;
        }
    }
}