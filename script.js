/**
 * Shows the impressum (legal notice) by removing the d-none class
 */
function showImpressum() {
    document.getElementById('impressum').classList.remove('d-none');
}

/**
 * Hides the impressum (legal notice) by adding the d-none class
 */
function closeImpressum() {
    document.getElementById('impressum').classList.add('d-none');
}

/**
 * Event listener for keydown events to handle keyboard controls
 * @param {KeyboardEvent} e - The keyboard event
 */
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

/**
 * Event listener for keyup events to handle keyboard controls
 * @param {KeyboardEvent} e - The keyboard event
 */
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

// Fullscreen change event listeners
document.addEventListener('fullscreenchange', adjustFullscreenSize);
document.addEventListener('webkitfullscreenchange', adjustFullscreenSize);
document.addEventListener('mozfullscreenchange', adjustFullscreenSize);
document.addEventListener('MSFullscreenChange', adjustFullscreenSize);