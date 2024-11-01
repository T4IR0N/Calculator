export { calculate }

const stackNumbers = [];  // стек для хранения чисел (операндов)
const StackOperators = []; // стек для хранения операторов (например, +, -, *, /)
const operators = {
    '+': { priority: 1, associativity: 'left' },

    '-': { priority: 1, associativity: 'left' },

    '*': { priority: 2, associativity: 'left' },

    '/': { priority: 2, associativity: 'left' },

    '%': { priority: 2, associativity: 'left' },

    '^': { priority: 3, associativity: 'right' },

    '√': { priority: 4, associativity: 'left' }
};

let currentNumber = ''; // текущее обрабатываемое число (буфер)


// Основная функция калькулятора (считаем всё выражение полностью)
function calculate(expression) {
    
    parseExpression(expression); // парсим и считаем выражение
    
    if (currentNumber) { addNumberToStack() }; // Добавляем последнее число в стек
    console.log(`Последнее число добавлено в стек`);
    while (StackOperators.length) { applyOperator() }; // Выполняем оставшиеся операции в стеке
    
    let result = stackNumbers.pop();
    // Если число дробное, возвращаем значение с точностью до 6 знаков
    return !Number.isInteger(result) ? parseFloat(result.toFixed(6)) : result;
  
}



// Токенизатор и сортировка (Функция парсинга символов в выражении и вычисления выражения с учетом приоритета операторов и скобок)
function parseExpression(expression) { 
    
    let isDigit, isPoint, isOperator, isUnaryMinus,
        isOpeningBracket, isAfterOperator, isFirstChar,
        isClosingBracket, isMinus, isPlus, isUnaryPlus;

    for (let i = 0; i < expression.length; i++) {
        
        const char = expression[i];
        isDigit = /\d/.test(char);
        isPoint = char === '.' && !(currentNumber.includes('.'));
        isOperator = Object.hasOwn(operators, char)
        isOpeningBracket = char === '(';
        isClosingBracket = char === ')';
        isMinus = char === '-';
        isPlus = char === '+';
        isAfterOperator = i > 0 && /[+\-*/^√(]/.test(expression[i - 1]);
        isFirstChar = i === 0;
        isUnaryMinus = isMinus && (!currentNumber && (isFirstChar || isAfterOperator));
        isUnaryPlus = isPlus && (!currentNumber && isAfterOperator);

        switch (true) {
            
            case isDigit || isPoint:
                currentNumber += char; // Строим число
                console.log(`Текущее число: ${currentNumber}`);
                break;
    
            case isUnaryMinus || isUnaryPlus:    
                currentNumber += char; // Унарный плюс/минус считается частью числа, поэтому продолжаем строить число
                console.log(`Добавлен унарный оператор: ${currentNumber}`);
                break;

            case isOperator:
                if (currentNumber) { addNumberToStack() }; // Добавляем собранное число в стек
                processOperator(char); // применяем предыдущие операторы с большим приоритетом
                StackOperators.push(char); // Добавляем оператор в стек операторов
                console.log(`Оператор добавлен в стек: ${char}`);
                break;
    
            case isOpeningBracket:   
                StackOperators.push(char); // Добавляем открывающую скобку
                console.log(`скобка добавлена в стек: ${char}`);
                break;
    
            case isClosingBracket:
                if (currentNumber) { addNumberToStack() }; // Добавляем последнее число перед закрывающейся скобкой в стек
                while (StackOperators.length && StackOperators.at(-1) !== '(') { // пока в стеке есть операторы 
                    applyOperator(); // Применяем операторы до открывающей скобки
                }
                StackOperators.pop(); // Удаляем открывающую скобку
                break;
            }
    }
}

// Функция добавления числа в стек и очистки буфера (currentNumber)
function addNumberToStack() {
    stackNumbers.push(parseFloat(currentNumber))
    currentNumber = '';    
}

function processOperator(operator) {
 
    while (StackOperators.length  && operators[StackOperators.at(-1)] // Проверяем что оператор в стеке существует
        && (operators[StackOperators.at(-1)].priority > operators[operator].priority // Проверяем что приоритет оператора в стеке больше
        || (operators[StackOperators.at(-1)].priority === operators[operator].priority // Или приоритет тот же и ассоциативность левая
        && operators[operator].associativity === 'left'))) {
        applyOperator(); // Применяем алгоритм вычисления
    }
}

// Функция сортировочной станции ОПЗ (вычисления выражения оператором из стека операторов и добавления полученного числа в стек чисел)
function applyOperator() {
    
    let currentOperator = StackOperators.pop();
    let rightOperand = stackNumbers.pop();
    let leftOperand = currentOperator !== '√' ? stackNumbers.pop() : null; // √ - унарный оператор, поэтому левый оператор равен null
    let result = performOperation(currentOperator, leftOperand, rightOperand); // проводим математическую операцию

    // Если текущий оператор - вовзедение в чётную степень отрицательного числа внутри скобок, то необходимо сохранить унарный минус:
    let isExponent = currentOperator === '^' && StackOperators.at(-1) === '(' && StackOperators.at(-2) !== '√' && leftOperand < 0 && rightOperand % 2 === 0
    if (isExponent) {
        result  = -result;
    }
    console.log(`Левый операнд: ${leftOperand}, Оператор: ${currentOperator}, Правый операнд: ${rightOperand}, Результат: ${result}`);
    stackNumbers.push(result);
}

// Функция для выполнения одной математической операции
function performOperation(operator, a, b) {
    switch (operator) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : 'Error'; // Обрабатываем деление на 0
        case '%': return a % b;
        case '^': return Math.pow(a, b);
        case '√': return Math.sqrt(b);
        default: return b;
    }
}


