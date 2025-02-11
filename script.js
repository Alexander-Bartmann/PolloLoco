function showImpressum() {
    document.getElementById('impressum').classList.remove('d-none');
}

function closeImpressum() {
    document.getElementById('impressum').classList.add('d-none');
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

document.addEventListener('fullscreenchange', adjustFullscreenSize);
document.addEventListener('webkitfullscreenchange', adjustFullscreenSize);
document.addEventListener('mozfullscreenchange', adjustFullscreenSize);
document.addEventListener('MSFullscreenChange', adjustFullscreenSize);