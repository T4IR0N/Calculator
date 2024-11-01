import { calculate } from './calculator.js'; 

// Получаем элементы DOM
const display = document.querySelector('.display');
const calcButtons = document.querySelectorAll('.calc-button');
// Привязываем обработчики событий
calcButtons.forEach(button => button.addEventListener('click', () => handleCalcButtonClick(button)));

const PI = Math.PI.toFixed(6); // Значение π
const E = Math.E.toFixed(6); // Значение e
const validDigits = '1234567890.'; // валидные цифры
const validOperators = "+-*/^%"; // валидные операторы
const unaryOperators = "√-"; // унарные операторы
const brackets = '()' // скобки
const maxInputLength = 18; // Максимальная длина ввода
let currentInput = ''; // Текущее вводимое значение
let currentExpression = ''; // Выражение для вычисления

// Функция для обновления дисплея
const updateDisplay = (value) => {
    display.textContent = value || '0';
}

// Обработчик для кнопок
const handleCalcButtonClick = (button) => {
    const value = button.textContent;
    
    // Если нажата кнопка очистки
    if (value === 'C') {
        currentInput = '';
        currentExpression = '';
        updateDisplay('0');
        return;
    }

    // Если нажата кнопка удаления символа
    if (value === 'Del') {
        if (currentExpression.length > 0) {
            currentExpression = currentExpression.slice(0, -1);
            currentInput = currentExpression; // Обновляем currentInput
            updateDisplay(currentExpression || '0');
        }
        return;
    }

    // Проверка длины ввода
    if (currentExpression.length > maxInputLength) return;

    // Проверка на точку
    if (value === '.' && currentInput.includes(value)) return;

    // Если нажаты кнопки числа Пи или Экспоненты
    if (value === 'π') {
        // Проверка, если последнее значение не равно значению π
        if (!currentExpression.endsWith(PI)) {
            currentInput += PI;
            currentExpression += PI; // Добавляем значение константы
            updateDisplay(currentExpression);
            return
        }
    } else if (value === 'e') {
        // Проверка, если последнее значение не равно значению e
        if (!currentExpression.endsWith(E)) {
            currentInput += E;
            currentExpression += E; // Добавляем значение константы
            updateDisplay(currentExpression);
            return
        }
    }
 
    if (validDigits.includes(value) || brackets.includes(value)) {
    currentInput += value; // Добавляем значение
    currentExpression += value; // Добавляем значение
    updateDisplay(currentExpression);
    }
    
    // Если нажата кнопка "="
    if (value === '=') {
        if (currentExpression) {
            console.log(`Выражение для вычисления: ${currentExpression}`);
            currentInput = String(calculate(currentExpression));
            currentExpression = currentInput;
            updateDisplay(currentInput);
        }
        return;
    }

    // Если нажат унарный минус или унарный оператор-квадратный корень
    if (unaryOperators.includes(value) && (!currentInput || currentExpression.endsWith("("))) {
        currentInput += value;
        currentExpression += value;
        updateDisplay(currentExpression);
        return;
    }


    // Если нажаты бинарные операторы
    if (validOperators.includes(value) && currentInput && !currentInput.endsWith("-")) {
        currentInput += value;
        currentExpression += value;
        updateDisplay(currentExpression);
        currentInput = '';
        return
    }

}


