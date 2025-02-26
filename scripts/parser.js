export default class Parser {
    
    static validOperators = {
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

    tokenize(expression) {

        let tokens = expression.match(/\d+\.?\d*(e[+\-]?\d+)?|lg|ln|sin|cos|tan|[πe+\-*/^√∛%!().]/g)
        let tokensWithConstants = tokens.map((char) => {
            if (char === 'π') char = Math.PI.toString();
            if (char === 'e') char = Math.E.toString();
            return char
        })
        console.log(tokensWithConstants);
        return tokensWithConstants
    }



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
                operators.push('*');

            } else if (Parser.validOperators[token]) {
                this.processOperator(token, operators, postfixExpression);

            } else if (token === '(') {
                operators.push(token);

            } else if (token === ')') {
                while (operators.length && operators.at(-1) !== '(') {
                    postfixExpression.push(operators.pop());
                }
                operators.pop(); // Убираем '('
            }

            previousToken = token;
        }
        
        console.log(postfixExpression);
        console.log(operators);
        while (operators.length) postfixExpression.push(operators.pop());
        console.log(postfixExpression);
        return postfixExpression;
    }

    processOperator(operator, operators, postfixExpression) {
        const { precedence, associativity } = Parser.validOperators[operator];

        while (operators.length) {
            const lastOperator = operators.at(-1);

            if (!Parser.validOperators[lastOperator]) break;

            const lastPrecedence = this.validOperators[lastOperator].precedence;

            if ((associativity === 'left' && lastPrecedence >= precedence) || 
                (associativity === 'right' && lastPrecedence > precedence)) {
                postfixExpression.push(operators.pop());
            } else break;
        }

        operators.push(operator);
    }


}






