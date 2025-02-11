let canvas;
let world;
let keyboard = new Keyboard();
let isFullscreen = false;

function initStartScreen() {
    document.getElementById('gameContainer').innerHTML = initStartscreenHtml();
    checkOrientation();
}

function startGame() {
    document.getElementById('gameContainer').innerHTML = renderCanvasTemplate();
    canvas = document.getElementById('canvas');
    init();
    world.startGame();
}

function init() {
    world = new World(canvas, keyboard);
    initMobileControls();
}

function initStartscreenHtml() {
    return `
        <div id="startScreen" class="startScreen">
            <img src="img/9_intro_outro_screens/start/startscreen_2.png" class="start-img">
            <img src="img/10_icons/play.png" onclick="startGame()" class="play-button">
            <img src="img/10_icons/die-info.png" onclick="showInfo()" class="info-button">
            <img src="img/10_icons/vollbild.png" onclick="fullscreen()" class="fullscreen">
            <img src="img/10_icons/ton-aus.png" onclick="audio()" class="audio">
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
            <div class="mobile-controls">
                <div class="dpad">
                    <button class="up" data-direction="up">▲</button>
                    <div class="horizontal-buttons">
                        <button class="left" data-direction="left">◀</button>
                        <button class="right" data-direction="right">▶</button>
                    </div>
                </div>
                <button class="bottle-mobil-throw" data-action="throw"><img src="img/6_salsa_bottle/salsa_bottle.png"></button>
            </div>
        </div>
        `;
}

function reloadGame() {
    location.reload();
}

function fullscreen() {
    let gameContainer = document.getElementById('gameContainer');
    let fullscreenButton = document.querySelector('.fullscreen');

    if (!isFullscreen) {
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
        } else if (gameContainer.webkitRequestFullscreen) {
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.msRequestFullscreen) {
            gameContainer.msRequestFullscreen();
        }
        fullscreenButton.src = 'img/10_icons/minimieren.png';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        fullscreenButton.src = 'img/10_icons/vollbild.png';
    }
    isFullscreen = !isFullscreen;
}

// Event Listener für Fullscreen-Änderungen
document.addEventListener('fullscreenchange', adjustFullscreenSize);
document.addEventListener('webkitfullscreenchange', adjustFullscreenSize);
document.addEventListener('mozfullscreenchange', adjustFullscreenSize);
document.addEventListener('MSFullscreenChange', adjustFullscreenSize);

function adjustFullscreenSize() {
    let gameContainer = document.getElementById('gameContainer');
    let canvas = document.getElementById('canvas');
    let startScreen = document.getElementById('startScreen');

    if (document.fullscreenElement) {
        // Vollbild-Modus
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        gameContainer.style.width = `${width}px`;
        gameContainer.style.height = `${height}px`;
        
        if (canvas) {
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        }
        if (startScreen) {
            startScreen.style.width = `${width}px`;
            startScreen.style.height = `${height}px`;
        }
    } else {
        // Normaler Modus
        gameContainer.style.width = '720px';
        gameContainer.style.height = '480px';
        
        if (canvas) {
            canvas.style.width = '100%';
            canvas.style.height = '100%';
        }
        if (startScreen) {
            startScreen.style.width = '100%';
            startScreen.style.height = '100%';
        }
    }
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

function checkOrientation() {
    if (isMobile()) {
        handleMobileOrientation();
        window.addEventListener('orientationchange', handleMobileOrientation);
        window.addEventListener('resize', handleMobileOrientation);
    }
}

function handleMobileOrientation() {
    const gameContainer = document.getElementById('gameContainer');
    
    if (window.matchMedia("(orientation: portrait)").matches) {
        // Portrait Modus
        showRotateMessage();
        gameContainer.classList.remove('landscape-mode');
        gameContainer.classList.add('portrait-mode');
    } else {
        // Landscape Modus
        hideRotateMessage();
        gameContainer.classList.remove('portrait-mode');
        gameContainer.classList.add('landscape-mode');
    }
}

function showRotateMessage() {
    let rotateMessage = document.querySelector('.rotate-message');
    if (!rotateMessage) {
        rotateMessage = document.createElement('div');
        rotateMessage.className = 'rotate-message';
        const rotateImg = document.createElement('img');
        rotateImg.src = 'img/10_icons/drehen.png';
        rotateImg.style.width = '100%';
        rotateImg.style.height = '100%';
        rotateMessage.appendChild(rotateImg);
        document.body.appendChild(rotateMessage);
    }
    rotateMessage.style.display = 'block';
}

function hideRotateMessage() {
    const rotateMessage = document.querySelector('.rotate-message');
    if (rotateMessage) {
        rotateMessage.style.display = 'none';
    }
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.matchMedia("(max-width: 768px)").matches;
}

function initMobileControls() {
    // D-Pad Controls
    document.querySelectorAll('.dpad button').forEach(button => {
        button.addEventListener('touchstart', handleTouchStart);
        button.addEventListener('touchend', handleTouchEnd);
    });

    // Bottle Button Control
    const bottleButton = document.querySelector('.bottle-mobil-throw');
    if (bottleButton) {
        bottleButton.addEventListener('touchstart', handleTouchStart);
        bottleButton.addEventListener('touchend', handleTouchEnd);
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    const element = e.currentTarget;
    
    if (element.classList.contains('bottle-mobil-throw')) {
        keyboard.r = true;
    } else {
        const direction = element.dataset.direction;
        switch(direction) {
            case 'left':
                keyboard.left = true;
                break;
            case 'right':
                keyboard.right = true;
                break;
            case 'up':
                keyboard.space = true;
                break;
        }
    }
}

function handleTouchEnd(e) {
    const element = e.currentTarget;
    
    if (element.classList.contains('bottle-mobil-throw')) {
        keyboard.r = false;
    } else {
        const direction = element.dataset.direction;
        switch(direction) {
            case 'left':
                keyboard.left = false;
                break;
            case 'right':
                keyboard.right = false;
                break;
            case 'up':
                keyboard.space = false;
                break;
        }
    }
}
