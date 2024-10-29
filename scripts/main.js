import { calculate } from "./calculator.js"; 

// Получаем элементы DOM
const display = document.querySelector('.display');
const calcButtons = document.querySelectorAll('.calc-Button');
const sideButtons = document.querySelectorAll('.side-Button');

const INPUT_MAX = 18; // Максимальная длина ввода
let currentInput = ''; // Текущее вводимое значение
let currentExpression = ''; // Выражение для вычисления

// Функция для обновления дисплея
const updateDisplay = (value) => {
    display.textContent = value || '0';
}

// Обработчик для кнопок с цифрами и точкой
const handleCalcButtonClick = (button) => {
    const value = button.textContent;
    const PI = Math.PI.toFixed(6); // Значение π
    const E = Math.E.toFixed(6); // Значение e
   
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
    if (currentExpression.length >= INPUT_MAX) return;

    // Проверка на точку
    if (value === '.' && currentInput.includes(value)) return;


    if (value === 'π') {
        // Проверка, если последнее значение не равно значению π
        if (!currentInput && !currentExpression.endsWith(PI)) {
            currentInput = PI;
            currentExpression += PI; // Добавляем значение константы
        }
    } else if (value === 'e') {
        // Проверка, если последнее значение не равно значению e
        if (!currentInput && !currentExpression.endsWith(E)) {
            currentInput = E;
            currentExpression += E; // Добавляем значение константы
        }
    } else {
        currentInput += value; // Добавляем значение
        currentExpression += value; // Добавляем значение
    }
    
    updateDisplay(currentExpression);
}


// Обработчик для операторов
const handleSideButtonClick = (button) => {
    const value = button.textContent;
    const validOperators = "+-*/^√%";
    const unaryOperators = "-√"
    if (value === '=') {
        if (currentExpression) {
            console.log(`Выражение для вычисления: ${currentExpression}`);
            currentInput = String(calculate(currentExpression));
            currentExpression = currentInput;
            updateDisplay(currentInput);
        }
        return;
    }

    if (validOperators.includes(value) && currentInput || unaryOperators.includes(value)) {
        currentExpression += value;
        currentInput = '';
        updateDisplay(currentExpression);
    }
}

// Привязываем обработчики событий
calcButtons.forEach(button => button.addEventListener('click', () => handleCalcButtonClick(button)));
sideButtons.forEach(button => button.addEventListener('click', () => handleSideButtonClick(button)));




