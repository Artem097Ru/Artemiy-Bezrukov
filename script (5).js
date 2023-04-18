let scoreBlock;  // отображение очков
let score = 0;  // счёт

// настройки игры
const config = {
    step: 0,
    maxStep: 6,
    sizeCell: 16,  // размер ячейки
    sizeBerry: 16 / 4  // размер ягоды
}

//координаты, скорость и ячейки змейки
const snake = {
    x: 16,
    y: 16,
    dx: config.sizeCell,
    dy: 0,
    tails: [],  // массив координат ячеек (x, y) под контролем змейки
    maxTails: 3  // количество ячеек змейки
}

//координты ягоды
let berry = {
    x: 0,
    y: 0
}



let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
scoreBlock = document.querySelector(".game-score .score-count");

drawScore(); // Первоначальная отрисовка счёта

function gameLoop() {

    requestAnimationFrame( gameLoop );
    if ( ++config.step < config.maxStep) {
        return;
    }
    config.step = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBerry();
    drawSnake();
}
requestAnimationFrame( gameLoop );

function drawSnake() {

    // Меняет координаты змейки
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Проверяет на столкновение с границами
    collisionBorder();

    // Добавляет новый объект в массив точек, 
    // принадлежащих змейке (добавляет головной элемент змейки)
    snake.tails.unshift( { x: snake.x, y: snake.y } );

    // Удаляет хвостовой элемент змейки
    if ( snake.tails.length > snake.maxTails ) {
        snake.tails.pop();
    }

    snake.tails.forEach( function(el, index) {
        
        // Задаёт цвет окраски для головного и остальных элементов змейки
        if (index == 0) {
            context.fillStyle = "#FA0556";
        } else {
            context.fillStyle = "#A00034";
        }

        // Окрашивает элементы змейки
        context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell );

        // Если съедается ягода
        if ( el.x === berry.x && el.y === berry.y) {
            snake.maxTails++;
            incScore();
            randomPositionBerry();
        }

        
        // Проверяет координаты одного элемента змейки с координатами остальных элементов
        // Если координаты совпадают, то игра начинается сначала
        for( let i = index + 1; i < snake.tails.length; i++ ) {

            if ( el.x === snake.tails[i].x && el.y === snake.tails[i].y ) {
                refreshGame();
            }

        }

    } );
}

// Змейка появляется на противоположной стороне, если уходит за границы
function collisionBorder() {
    if (snake.x < 0) {
        snake.x = canvas.width - config.sizeCell;
    } else if ( snake.x >= canvas.width ) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - config.sizeCell;
    } else if ( snake.y >= canvas.height ) {
        snake.y = 0;
    }
}

// Сбрасывает параметры при поражении
function refreshGame() {
    score = 0;
    drawScore();

    snake.x = 16;
    snake.y = 16;
    snake.tails = [];
    snake.maxTails = 3;
    snake.dx = config.sizeCell;
    snake.dy = 0;
}

function drawBerry() {
    context.beginPath();
    context.fillStyle = "#A00034";
    context.arc( berry.x + (config.sizeCell / 2), berry.y + (config.sizeCell / 2), config.sizeBerry, 0, 2 * Math.PI);
    context.fill();
}

//назначает координаты ягоды случайным образом
function randomPositionBerry() {
    berry.x = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell;
    berry.y = getRandomInt( 0, canvas.height / config.sizeCell ) * config.sizeCell;
}





// Добавляем уровни сложности и меняем стили кнопок
let btnEasy = document.getElementById('btn-easy');
let btnHard = document.getElementById('btn-hard');

btnEasy.addEventListener("click", () => {
    config.maxStep = 6;

    btnEasy.style.color = "#13a50e";
    btnEasy.style.backgroundColor = "#161618";

    btnHard.style.color = "#FA0556";
    btnHard.style.backgroundColor = "#252527";

});

btnHard.addEventListener("click", () => {
    config.maxStep = 3;

    btnEasy.style.color = "#FA0556";
    btnEasy.style.backgroundColor = "#252527";

    btnHard.style.color = "#13a50e";
    btnHard.style.backgroundColor = "#161618";

});














// Увеличивает значение очков
function incScore() {
    score++;
    drawScore();
}

// Обновляет количество очков на странице
function drawScore() {
    scoreBlock.innerHTML = score;
}

// Возвращает случайное число в диапазоне (min, max)
function getRandomInt(min, max) {
    return Math.floor( Math.random() * (max - min) + min );
}

// Меняет направление движения змейки с помощью WASD и не позволяет поворачивать на 180 градусов
document.addEventListener("keydown", function (e) {
    if ( e.code == "KeyW" && (snake.dy != -config.sizeCell && snake.dx != 0)) {
        snake.dy = -config.sizeCell;
        snake.dx = 0;
    } else if ( e.code == "KeyA" && (snake.dx != -config.sizeCell && snake.dy != 0)) {
        snake.dx = -config.sizeCell;
        snake.dy = 0;
    } else if ( e.code == "KeyS" && (snake.dy != config.sizeCell && snake.dx != 0)) {
        snake.dy = config.sizeCell;
        snake.dx = 0;
    } else if ( e.code == "KeyD" && (snake.dx != config.sizeCell && snake.dy != 0)) {
        snake.dx = config.sizeCell;
        snake.dy = 0;
    }
});