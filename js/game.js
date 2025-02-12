/** @type {HTMLCanvasElement} */
let canvas;
/** @type {World} */
let world;
/** @type {Keyboard} */
let keyboard = new Keyboard();
/** @type {boolean} */
let isFullscreen = false;
/** @type {boolean} */
let isMuted = false;

/**
 * Initializes the game by setting up initial state and starting screen
 */
function initGame() {
    isMuted = localStorage.getItem('isMuted') === 'true';
    initStartScreen();
}

/**
 * Initializes the start screen and sets up initial UI elements
 */
function initStartScreen() {
    document.getElementById('gameContainer').innerHTML = initStartscreenHtml();
    checkOrientation();
    const audioButton = document.querySelector('.audio');
    audioButton.src = isMuted ? 'img/10_icons/ton-aus.png' : 'img/10_icons/lautstarke-des-lautsprechers.png';
}

/**
 * Starts the game by initializing canvas and world
 */
function startGame() {
    document.getElementById('gameContainer').innerHTML = renderCanvasTemplate();
    canvas = document.getElementById('canvas');
    init();
    world.startGame();
    if (isMuted) {
        muteAllSounds();
    }
}

/**
 * Restarts the game by stopping current world and reinitializing
 */
function restartGame() {
    if (world) {
        world.stopGame();
    }
    document.getElementById('gameContainer').innerHTML = renderCanvasTemplate();
    canvas = document.getElementById('canvas');
    level1 = initLevel1();
    init();
    world.startGame();
    if (isMuted) {
        muteAllSounds();
    }
}

/**
 * Initializes the game world and mobile controls
 */
function init() {
    world = new World(canvas, keyboard);
    initMobileControls();
}

/**
 * Closes the info dialog if present
 */
function closeInfo() {
    const infoDialog = document.querySelector('.info-dialog');
    if (infoDialog) {
        infoDialog.remove();
    }
}

/**
 * Reloads the entire game page
 */
function reloadGame() {
    location.reload();
}

/**
 * Toggles fullscreen mode for the game container
 */
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

/**
 * Enables fullscreen mode
 * @param {HTMLElement} gameContainer - The game container element
 * @param {HTMLImageElement} fullscreenButton - The fullscreen button element
 */
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

/**
 * Disables fullscreen mode
 * @param {HTMLImageElement} fullscreenButton - The fullscreen button element
 */
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

/**
 * Adjusts the size of game elements based on fullscreen state
 */
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

/**
 * Sets fullscreen dimensions for game elements
 * @param {HTMLElement} gameContainer - The game container element
 * @param {HTMLCanvasElement} canvas - The game canvas element
 * @param {HTMLElement} startScreen - The start screen element
 */
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

/**
 * Resets dimensions to default for game elements
 * @param {HTMLElement} gameContainer - The game container element
 * @param {HTMLCanvasElement} canvas - The game canvas element
 * @param {HTMLElement} startScreen - The start screen element
 */
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

/**
 * Checks device orientation and sets up orientation handlers if on mobile
 */
function checkOrientation() {
    if (isMobile()) {
        handleMobileOrientation();
        window.addEventListener('orientationchange', handleMobileOrientation);
        window.addEventListener('resize', handleMobileOrientation);
    }
}

/**
 * Handles orientation changes on mobile devices
 */
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

/**
 * Displays the rotate device message on mobile devices
 */
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

/**
 * Hides the rotate device message
 */
function hideRotateMessage() {
    const rotateMessage = document.querySelector('.rotate-message');
    if (rotateMessage) {
        rotateMessage.style.display = 'none';
    }
}

/**
 * Checks if the current device is a mobile device
 * @returns {boolean} True if device is mobile, false otherwise
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.matchMedia("(max-width: 768px)").matches;
}

/**
 * Initializes touch controls for mobile devices
 */
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

/**
 * Handles touch start events for mobile controls
 * @param {TouchEvent} e - The touch event object
 */
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

/**
 * Handles touch end events for mobile controls
 * @param {TouchEvent} e - The touch event object
 */
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

/**
 * Toggles audio mute state for all game sounds
 */
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

/**
 * Mutes all game sounds
 */
function muteAllSounds() {
    if (world) {
        world.coinSound.muted = true;
        world.winSound.muted = true;
        world.loseSound.muted = true;
        world.character.hurtSound.muted = true;
        world.character.runSound.muted = true;
        world.character.jumpSound.muted = true;
        world.endboss.attackSound.muted = true;
        muteAllThrowableSounds();
    }
}

/**
 * Mutes all throwable object sounds
 */
function muteAllThrowableSounds() {
    world.throwableObjects.forEach(bottle => {
        bottle.splashSound.muted = true;
    });
    world.level.enemies.forEach(enemy => {
        if (enemy.dieSound) {
            enemy.dieSound.muted = true;
        }
    });
}

/**
 * Unmutes all game sounds
 */
function unmuteAllSounds() {
    if (world) {
        world.coinSound.muted = false;
        world.winSound.muted = false;
        world.loseSound.muted = false;
        world.character.hurtSound.muted = false;
        world.character.runSound.muted = false;
        world.character.jumpSound.muted = false;
        world.endboss.attackSound.muted = false;
        unmuteAllThrowableSounds();
    }
}

/**
 * Unmutes all throwable object sounds
 */
function unmuteAllThrowableSounds() {
    world.throwableObjects.forEach(bottle => {
        bottle.splashSound.muted = false;
    });
    world.level.enemies.forEach(enemy => {
        if (enemy.dieSound) {
            enemy.dieSound.muted = false;
        }
    });
}