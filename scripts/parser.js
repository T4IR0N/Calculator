export default class Parser {
    
    static validOperators = {
        '+':   { precedence: 1, associativity: 'left' },
        '-':   { precedence: 1, associativity: 'left' },
        '×':   { precedence: 2, associativity: 'left' },
        '÷':   { precedence: 2, associativity: 'left' },
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
        'cot': { precedence: 4, associativity: null },
    };

    tokenize(expression) {

        let tokens = expression.match(/\d+\.?\d*(e[+\-]?\d+)?|lg|ln|sin|cos|tan|cot|[πe+\-×÷^√∛%!().]/g)
        tokens = tokens.map((char) => {
            if (char === 'π') char = Math.PI.toString();
            if (char === 'e') char = Math.E.toString();
            return char
        })
        console.log(`Токены в инфиксной записи:`);
        console.log(tokens);
        return tokens
    }

    /**
     * Преобразует токены инфиксного математического выражения
     * в постфиксное выражение (обратная польская запись) 
     * с использованием алгоритма сортировочной станции.
     * 
     * @param {array<string|number>} tokens - токены инфиксного выражения.
     * @returns {array<string|number>} постфиксное выражение.
     */
    parseToPostfix(tokens) {

        const postfixExpression = [];
        const operators = [];
        let previousToken = '';
        
        const isUnaryMinus = (token) => token === '-' && 
                                        (previousToken === '' ||
                                        Parser.validOperators[previousToken] ||
                                        previousToken === '(');

        for (const token of tokens) {
            if (!isNaN(token)) {
                postfixExpression.push(parseFloat(token));

            } else if (isUnaryMinus(token)) {
                postfixExpression.push(-1);
                operators.push('×');
                
            } else if (Parser.validOperators[token]) {
                this.processOperator(token, operators, postfixExpression);
                operators.push(token);

            } else if (token === '(') {
                operators.push(token);

            } else if (token === ')') {
                while (operators.length && operators.at(-1) !== '(') {
                    postfixExpression.push(operators.pop());
                }
                operators.pop(); 
            }

            previousToken = token;
        }
        
        while (operators.length) postfixExpression.push(operators.pop());

        console.log(`Токены в постфиксной записи:`);
        console.log(postfixExpression);
        return postfixExpression;
    }

    /**
     * Обрабатывает приоритет оператора и размещает его в правильной позиции в постфиксном выражении.
     *
     * @param {string} operator - оператор для обработки.
     * @param {Array<string>} operators - стек операторов.
     * @param {Array<number|string>} postfixExpression - постфиксное выражение.
     *
     * @description
     *      1. Проверяет, находится ли на вершине стека оператор
     *      с большим или равным приоритетом (левоассоциативный оператор) или
     *      только с большим приоритетом (правоассоциативный оператор).
     *      2. Если да, извлекает его из стека операторов и добавляет в постфиксную запись.
     *      3. Операция повторяется пока в стеке есть операторы с большим или равным приоритетом
     */
    processOperator(operator, operators, postfixExpression) {
        const { precedence, associativity } = Parser.validOperators[operator];

        while (operators.length) {
            const lastOperator = operators.at(-1);

            if (!Parser.validOperators[lastOperator]) break;

            const lastOperatorPrecedence = Parser.validOperators[lastOperator].precedence;

            if ((associativity === 'left' && (lastOperatorPrecedence >= precedence)) || 
                (associativity === 'right' && (lastOperatorPrecedence > precedence))) {

                postfixExpression.push(operators.pop());
            } 
            else break;
        }
    }
}






