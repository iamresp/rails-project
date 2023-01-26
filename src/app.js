let elem = document.getElementById("zombie");
elem.style.top = '90%'
elem.style.left = '45%'
let diff = 5

document.addEventListener("keydown", function (event) {
    if (event.code != "ArrowRight" && event.code != "ArrowLeft" &&
        event.code != "ArrowUp" && event.code != "ArrowDown") return;

    let rectElem = elem.getBoundingClientRect();
    let x = rectElem.x,
        y = rectElem.y;

    if (event.code == "ArrowRight") x += diff;
    if (event.code == "ArrowLeft")  x -= diff;
    if (event.code == "ArrowUp")    y -= diff;
    if (event.code == "ArrowDown")  y += diff;
    
    elem.style.left = x + "px";
    elem.style.top = y + "px";
});
