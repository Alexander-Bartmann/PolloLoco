let canvas;
let world;
let keyboard = new Keyboard();

function initStartScreen() {
    document.getElementById('gameContainer').innerHTML = initStartscreenHtml();
}

function startGame() {
    document.getElementById('gameContainer').innerHTML = renderCanvasTemplate();
    canvas = document.getElementById('canvas');
    init();
    world.startGame();
}

function init() {
    world = new World(canvas, keyboard);
}

function initStartscreenHtml() {
    return `
        <div id="startScreen" class="startScreen">
            <img src="img/9_intro_outro_screens/start/startscreen_2.png" class="start-img">
            <img src="img/10_icons/play.png" onclick="startGame()" class="play-button">
            <img src="img/10_icons/info.png" onclick="showInfo()" class="info-button">
        </div>
    `;
}

function showInfo() {
    const infoDialog = `
        <div class="info-dialog">
            <div class="info-content">
                <h2>Steuerung</h2>
                <ul>
                    <li>← or A = Left</li>
                    <li>→ or D = Right</li>
                    <li>Space = Jump</li>
                    <li>R = Throw</li>
                </ul>
                <button onclick="closeInfo()" class="btn">Close</button>
            </div>
        </div>
    `;
    document.getElementById('gameContainer').insertAdjacentHTML('beforeend', infoDialog);
}

function closeInfo() {
    const infoDialog = document.querySelector('.info-dialog');
    if (infoDialog) {
        infoDialog.remove();
    }
}

function renderCanvasTemplate() {
    return `
        <div class="game">
            <canvas id="canvas" width="720" height="480"></canvas>
            <button onclick="reloadGame()" id="restartButton" class="restartButton">Restart Game</button>
        </div>
        `;
}

function reloadGame() {
    location.reload();
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
