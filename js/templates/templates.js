/**
 * Renders the HTML template for the game canvas and mobile controls
 * @returns {string} HTML string containing canvas and mobile control elements
 */
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

/**
 * Renders the HTML template for the start screen
 * @returns {string} HTML string containing start screen elements
 */
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

/**
 * Shows the info dialog with game controls
 * Injects the info dialog HTML into the game container
 */
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