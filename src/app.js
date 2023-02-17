// Неизменяемые переменные
const MOVEMENT_DELTA = 1;

const WALLS = document.getElementById("walls");
const MARKERS = document.querySelectorAll(".marker");
const PLAYER = document.getElementById("player");

// нач. позиция игрока
PLAYER.style.top = "calc(100% - px)";
PLAYER.style.left = "px";

let objects = [];

/**
 * Обработчик события нажатия на клавишу клавиатуры.
 */
function onKeyDown(event) {
  //Проверка на иную нажатую кнопку, кроме "стрелки". Если нажата не "стрелка", то ничего не должно выполниться
  if (
    event.code != "ArrowUp" &&
    event.code != "ArrowRight" &&
    event.code != "ArrowDown" &&
    event.code != "ArrowLeft"
  )
    return;

  PLAYER.classList.add("move");

  // Получаем координаты игрока
  let { x, y } = PLAYER.getBoundingClientRect();

  // Проверка на возможность столкновения и его направления
  const collision = detectCollision(PLAYER, objects);

  // getObject возвращает объект, с которым произошло столкновение
  const collidedObj = getObject();

  if (collidedObj && collidedObj.id) {
    PLAYER.classList.add("talk");
    //Открытие модалки с видео
    openModal(collidedObj.id);
  } else {
    PLAYER.classList.remove("talk");
  }

  PLAYER.classList.remove("up", "down", "left", "right");

  switch (event.code) {
    // Обработка события при нажатии кнопки вправо
    case "ArrowRight":
      {
        PLAYER.classList.add("right");
        // Если справа есть препятствие, то ничего не делать
        if (collision && collision.right) return;
        x = x + MOVEMENT_DELTA;
      }
      break;
    // Обработка события при нажатии кнопки влево
    case "example1":
      /** Напиши сам  */
      break;
    // Обработка события при нажатии кнопки вверх
    case "example2":
      {
        /** Напиши сам */
      }
      break;
    // Обработка события при нажатии кнопки вниз
    case "example3":
      {
        /** Напиши сам */
      }
      break;
  }
  // Задаем положение игрока на карте
  PLAYER.style.left = `${x}px`;
  PLAYER.style.top = `${y}px`;
}

/**
 * Обработчик события отпускания клавиши.
 */
function onKeyUp() {
  PLAYER.classList.remove("move");
}

/**
 * Инициализируем объекты по мере загрузки карты.
 * Порядок обработчиков важен!
 */
WALLS.addEventListener("load", onMapLoad);

/**
 * Обработчик загрузки карты.
 */
function onMapLoad() {
  objects = getObstacles(WALLS, MARKERS);

  WALLS.contentDocument.addEventListener("keydown", onKeyDown);
  document.addEventListener("keydown", onKeyDown);
}
