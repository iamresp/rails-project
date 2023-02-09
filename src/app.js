// константы
const MOVEMENT_DELTA = 1; // т. к. на карте есть очень мелкие элементы (~2px), если выставить значение больше, можно проскочить объект целиком
const WALLS = document.getElementById("walls");
const MARKERS = [...document.querySelectorAll('.marker')];
const PLAYER = document.getElementById("player");

// нач. позиция игрока
PLAYER.style.top = "calc(100% - 160px)"; // не используем bottom!
PLAYER.style.left = "541px";

let objects = [];

/**
 * Проверяет наличие столкновения с любым из объектов. Найдя столкновение, высчитывает направление, в котором
 * оно произошло. Возвращает объект, содержащий признаки стокновения по каждому из направлений.
 */
function detectCollision (x, y, w, h) {
    // 1) проверяем наличие столкновений
    const collidedObj = objects.find(
        // при выполнении всех условий считаем, что произошла коллизия объектов
        (obj) => {
            const { top, right, bottom, left } = obj.getBoundingClientRect(); // снизит производительность, но объяснить будет проще

            return [
                left <= x + w,
                right >= x,
                top <= y + h,
                bottom >= y
            ].every(Boolean)
        }
    )

    // 2) если столкновение произошло, показываем для подходящих объектов диалог и определяем направление столкновения
    if (collidedObj) {
        if (MARKERS.includes(collidedObj)) {
            PLAYER.style.backgroundImage = '../../media/pers1_says.gif'
            openModal?.(collidedObj.id);
        }
        // уточняем, по какому направлению движения игрока произошло столкновение
        const { bottom, left, right, top } = collidedObj.getBoundingClientRect();
        return {
            top: top <= y && bottom < y + h,
            bottom: bottom >= y + h && top > y,
            left: left <= x && right < x + w,
            right: right >= x + w && left > x,
        }
    }
}

/**
 * Обработчик события нажатия на клавишу клавиатуры.
 */
function onKeyDown (event) {
    if (!["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.code)) return;

    PLAYER.classList.add("move");

    let { height, x, width, y } = PLAYER.getBoundingClientRect();
    const collision = detectCollision(x, y, width, height);

    switch (event.code) {
        case "ArrowRight": {
            PLAYER.classList.remove("up", "down", "left");
            PLAYER.classList.add("right");
            if (collision?.right) return;
            x += MOVEMENT_DELTA;
        } break;
        case "ArrowLeft": {
            PLAYER.classList.remove("up", "down", "right");
            PLAYER.classList.add("left");
            if (collision?.left) return;
            x -= MOVEMENT_DELTA;
        } break;
        case "ArrowUp": {
            PLAYER.classList.remove("right", "down", "left");
            PLAYER.classList.add("up");
            if (collision?.top) return;
            y -= MOVEMENT_DELTA;
        } break;
        case "ArrowDown": {
            PLAYER.classList.remove("up", "right", "left");
            PLAYER.classList.add("down");
            if (collision?.bottom) return;
            y += MOVEMENT_DELTA;
        } break;
    }

    PLAYER.style.left = `${x}px`;
    PLAYER.style.top = `${y}px`;
}

/**
 * Обработчик события отпускания клавиши.
 */
function onKeyUp () {
    PLAYER.classList.remove("move");
}

/**
 * Инициализируем объекты по мере загрузки карты.
 * Порядок обработчиков важен!
 */
WALLS.addEventListener("load", () => {
    objects = [
        ...WALLS.contentDocument.childNodes[1].querySelectorAll("rect") ,
        ...MARKERS,
    ].filter(({ nodeName }) => ["rect", "IMG"].includes(nodeName));

    // у object свой, отдельный документ - если кликнуть по нему, работа перейдет в его контекст
    // соответственно, если у него не будет тех же обработчиков, события не будут обрабатываться, пока не вернемся обратно
    WALLS.contentDocument.addEventListener("keydown", onKeyDown);
    document.addEventListener("keydown", onKeyDown);

    WALLS.contentDocument.addEventListener("keyup", onKeyUp);
    document.addEventListener("keyup", onKeyUp);
});
