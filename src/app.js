// константы
const MOVEMENT_DELTA = 1; // т. к. на карте есть очень мелкие элементы (~2px), если выставить значение больше, можно проскочить объект целиком
const MAP = document.getElementById("map");
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
    const collidedObj = objects.find(
        // при выполнении всех условий считаем, что произошла коллизия объектов
        ({ bottom, left, right, top }) => [
            left <= x + w,
            right >= x,
            top <= y + h,
            bottom >= y
        ].every(Boolean)
    )

    if (collidedObj) {
        // уточняем, по какому направлению движения игрока произошло столкновение
        const { bottom, left, right, top } = collidedObj;
        return {
            top: top <= y && bottom < y + h,
            bottom: bottom >= y + h && top > y,
            left: left <= x && right < x + w,
            right: right >= x + w && left > x,
        }
    }
}

/**
 * Инициализируем объекты по мере загрузки карты.
 */
MAP.addEventListener("load", () => {
    objects = [...MAP.contentDocument.childNodes[0].querySelector("g").childNodes]
        .filter(({ nodeName }) => ["path", "rect"].includes(nodeName))
        .map(obj => obj.getBoundingClientRect?.());
});

document.addEventListener("keydown", event => {
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
});

document.addEventListener("keyup", () => {
    PLAYER.classList.remove("move");
});
