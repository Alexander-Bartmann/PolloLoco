let canvas;
let world;
let keyboard = new Keyboard();

function init(){
    canvas = document.getElementById('canvas');
    world = new World(canvas , keyboard);
    console.log('My Character is ' , world.character);
    console.log('endboss is ' , world.endboss);
}

window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowRight" || e.code === "KeyD") {
        keyboard.right = true;
    }
    if (e.code === "ArrowLeft" || e.code === "KeyA") {
        keyboard.left = true;
    }
    if (e.code === "ArrowUp" || e.code === "KeyW") {
        keyboard.up = true;
    }
    if (e.code === "ArrowDown" || e.code === "KeyS") {
        keyboard.down = true;
    }
    if (e.code === "Space") {
        keyboard.space = true;
    }
    if (e.code === "KeyR") {
        keyboard.r = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowRight" || e.code === "KeyD") {
        keyboard.right = false;
    }
    if (e.code === "ArrowLeft" || e.code === "KeyA") {
        keyboard.left = false;
    }
    if (e.code === "ArrowUp" || e.code === "KeyW") {
        keyboard.up = false;
    }
    if (e.code === "ArrowDown" || e.code === "KeyS") {
        keyboard.down = false;
    }
    if (e.code === "Space") {
        keyboard.space = false;
    }
    if (e.code === "KeyR") {
        keyboard.r = false;
    }
});
