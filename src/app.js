// константы
const MOVEMENT_DELTA = 1;
const WALLS = document.getElementById("walls");
const MARKERS = document.querySelectorAll(".marker");
const PLAYER = document.getElementById("player");

// нач. позиция игрока
PLAYER.style.top = "calc(100% - 300px)";
PLAYER.style.left = "100px";

let objects = [];

/**
 * Обработчик события нажатия на клавишу клавиатуры.
 */
function onKeyDown(event) {
  //Проверка на иную нажатую кнопку, кроме "стрелки". Если нажата не "стрелка", то ничего не должно выполниться
  if (!["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.code)) return;

  PLAYER.classList.add("move");

  let { x, y } = PLAYER.getBoundingClientRect();
  const collision = detectCollision(PLAYER, objects);

  const collidedObj = getObject();

  if (collidedObj) {
    if (collidedObj.id) {
      PLAYER.classList.add("talk");
      openModal(collidedObj.id);
    } else {
      PLAYER.classList.remove("talk");
    }
  }

  PLAYER.classList.remove("up", "down", "left", "right");

  switch (event.code) {
    case "ArrowRight":
      {
        PLAYER.classList.add("right");
        if (collision?.right) return;
        x = x + MOVEMENT_DELTA;
      }
      break;
    case "ArrowLeft":
      {
        /** Напиши сам */
        PLAYER.classList.add("left");
        if (collision?.left) return;
        x = x - MOVEMENT_DELTA;
      }
      break;
    case "ArrowUp":
      {
        /** Напиши сам */
        PLAYER.classList.add("up");
        if (collision?.top) return;
        y = y - MOVEMENT_DELTA;
      }
      break;
    case "ArrowDown":
      {
        /** Напиши сам */
        PLAYER.classList.add("down");
        if (collision?.bottom) return;
        y = y + MOVEMENT_DELTA;
      }
      break;
  }

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
WALLS.addEventListener("load", () => {
  objects = getObstacles(WALLS, MARKERS);

  // у object свой, отдельный документ - если кликнуть по нему, работа перейдет в его контекст
  // соответственно, если у него не будет тех же обработчиков, события не будут обрабатываться, пока не вернемся обратно
  WALLS.contentDocument.addEventListener("keydown", onKeyDown);
  document.addEventListener("keydown", onKeyDown);

  WALLS.contentDocument.addEventListener("keyup", onKeyUp);
  document.addEventListener("keyup", onKeyUp);
});
