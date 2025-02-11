let canvas;
let world;
let keyboard = new Keyboard();
let isFullscreen = false;
let isMuted = false;

function initGame() {
    isMuted = localStorage.getItem('isMuted') === 'true';
    initStartScreen();
}

function initStartScreen() {
    document.getElementById('gameContainer').innerHTML = initStartscreenHtml();
    checkOrientation();
    const audioButton = document.querySelector('.audio');
    audioButton.src = isMuted ? 'img/10_icons/ton-aus.png' : 'img/10_icons/lautstarke-des-lautsprechers.png';
}

function startGame() {
    document.getElementById('gameContainer').innerHTML = renderCanvasTemplate();
    canvas = document.getElementById('canvas');
    init();
    world.startGame();
    if (isMuted) {
        muteAllSounds();
    }
}

function restartGame() {
    if (world) {
        world.stopGame();
    }
    document.getElementById('gameContainer').innerHTML = renderCanvasTemplate();
    canvas = document.getElementById('canvas');
    init();
    world.startGame();
    if (isMuted) {
        muteAllSounds();
    }
}

function init() {
    world = new World(canvas, keyboard);
    initMobileControls();
}

function closeInfo() {
    const infoDialog = document.querySelector('.info-dialog');
    if (infoDialog) {
        infoDialog.remove();
    }
}

function reloadGame() {
    location.reload();
}

function fullscreen() {
    let gameContainer = document.getElementById('gameContainer');
    let fullscreenButton = document.querySelector('.fullscreen');

    if (!isFullscreen) {
        fullScreenTrue(gameContainer, fullscreenButton);
    } else {
        fullScreenFalse(fullscreenButton);
    }
    isFullscreen = !isFullscreen;
}

function fullScreenTrue(gameContainer, fullscreenButton) {
    if (gameContainer.requestFullscreen) {
        gameContainer.requestFullscreen();
    } else if (gameContainer.webkitRequestFullscreen) {
        gameContainer.webkitRequestFullscreen();
    } else if (gameContainer.msRequestFullscreen) {
        gameContainer.msRequestFullscreen();
    }
    fullscreenButton.src = 'img/10_icons/minimieren.png';
}

function fullScreenFalse(fullscreenButton) {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    fullscreenButton.src = 'img/10_icons/vollbild.png';
}

function adjustFullscreenSize() {
    let gameContainer = document.getElementById('gameContainer');
    let canvas = document.getElementById('canvas');
    let startScreen = document.getElementById('startScreen');

    if (document.fullscreenElement) {
        fullScreenSizeTrue(gameContainer, canvas, startScreen);
    } else {
        fullScreenSizeFalse(gameContainer, canvas, startScreen);
    }
}

function fullScreenSizeTrue(gameContainer, canvas, startScreen) {
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
}

function fullScreenSizeFalse(gameContainer, canvas, startScreen) {
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
        showRotateMessage();
        gameContainer.classList.remove('landscape-mode');
        gameContainer.classList.add('portrait-mode');
    } else {
        hideRotateMessage();
        gameContainer.classList.remove('portrait-mode');
        gameContainer.classList.add('landscape-mode');
    }
}

function showRotateMessage() {
    if (!window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

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
    document.querySelectorAll('.dpad button').forEach(button => {
        button.addEventListener('touchstart', handleTouchStart);
        button.addEventListener('touchend', handleTouchEnd);
    });

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

function audio() {
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    const audioButton = document.querySelector('.audio');
    
    if (isMuted) {
        audioButton.src = 'img/10_icons/ton-aus.png';
        if (world) { 
            muteAllSounds();
        }
    } else {
        audioButton.src = 'img/10_icons/lautstarke-des-lautsprechers.png';
        if (world) {
            unmuteAllSounds();
        }
    }
}

function muteAllSounds() {
    if (world) {
        world.coinSound.muted = true;
        world.winSound.muted = true;
        world.loseSound.muted = true;
        world.character.hurtSound.muted = true;
        world.character.runSound.muted = true;
        world.character.jumpSound.muted = true;
        world.endboss.attackSound.muted = true;
        world.throwableObjects.forEach(bottle => {
            bottle.splashSound.muted = true;
        });
        world.level.enemies.forEach(enemy => {
            if (enemy.dieSound) {
                enemy.dieSound.muted = true;
            }
        });
    }
}

function unmuteAllSounds() {
    if (world) {
        world.coinSound.muted = false;
        world.winSound.muted = false;
        world.loseSound.muted = false;
        world.character.hurtSound.muted = false;
        world.character.runSound.muted = false;
        world.character.jumpSound.muted = false;
        world.endboss.attackSound.muted = false;
        world.throwableObjects.forEach(bottle => {
            bottle.splashSound.muted = false;
        });
        world.level.enemies.forEach(enemy => {
            if (enemy.dieSound) {
                enemy.dieSound.muted = false;
            }
        });
    }
}
