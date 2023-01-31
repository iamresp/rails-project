// константы
const MOVEMENT_DELTA = 1; // т. к. на карте есть очень мелкие элементы (~2px), если выставить значение больше, можно проскочить объект целиком
const MAP = document.getElementById("map");
const PLAYER = document.getElementById("zombie");

// нач. позиция игрока
PLAYER.style.top = "calc(100% - 160px)"; // не используем bottom!
PLAYER.style.left = "541px";

let objects = [];

/**
 * Возвращает bounding box переданного элемента.
 */
function computeBoundingBox (elem) {
    const { bottom, left, right, top } = elem.getBoundingClientRect();

    return { bottom, left, right, top };
}

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
        .map(computeBoundingBox);
});

document.addEventListener("keydown", event => {
    if (!["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.code)) return;

    const h = PLAYER.height, w = PLAYER.width;
    let { x, y } = PLAYER.getBoundingClientRect();

    const collision = detectCollision(x, y, w, h);
    
    // тест коллизии
    if (collision) {
        PLAYER.classList.add("collided");
    } else {
        PLAYER.classList.remove("collided");
    }

    switch (event.code) {
        case "ArrowRight":
            if (collision?.right) return;
            x += MOVEMENT_DELTA;
            break;
        case "ArrowLeft":
            if (collision?.left) return;
            x -= MOVEMENT_DELTA;
            break;
        case "ArrowUp":
            if (collision?.top) return;
            y -= MOVEMENT_DELTA;
            break;
        case "ArrowDown":
            if (collision?.bottom) return;
            y += MOVEMENT_DELTA;
            break;
    }
    
    PLAYER.style.left = `${x}px`;
    PLAYER.style.top = `${y}px`;
});
