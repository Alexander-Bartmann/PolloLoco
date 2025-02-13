/**
 * Class representing the game world
 */
class World {
    /** @type {Character} - The main player character */
    character = new Character();
    /** @type {Level} - Current game level */
    level = level1;
    /** @type {CanvasRenderingContext2D} - Canvas rendering context */
    ctx;
    /** @type {HTMLCanvasElement} - Game canvas element */
    canvas;
    /** @type {Keyboard} - Keyboard input handler */
    keyboard;
    /** @type {number} - Camera x position */
    camera_x = 0;
    /** @type {StatusBar} - Health status bar */
    statusbar = new StatusBar();
    /** @type {CoinBar} - Coin collection status bar */
    coinbar = new CoinBar();
    /** @type {BottleBar} - Bottle collection status bar */
    bottlebar = new BottleBar();
    /** @type {Array<ThrowableObject>} - Throwable bottles array */
    throwableObjects = [];
    /** @type {Array<Coins>} - Collectible coins array */
    coins = [];
    /** @type {Array<StaticBottle>} - Collectible bottles array */
    bottles = [];
    /** @type {Endboss} - Level final boss */
    endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    /** @type {EndbossStatusBar} - Endboss health bar */
    endbossStatusBar = new EndbossStatusBar();
    /** @type {HTMLImageElement} - Game over screen image */
    gameOverImage = new Image();
    /** @type {HTMLImageElement} - Game won screen image */
    gameWonImage = new Image();
    /** @type {boolean} - Game end timeout status */
    gameEndTimeout = false;
    /** @type {boolean} - End screen visibility status */
    endScreenVisible = false;
    /** @type {HTMLAudioElement} - Coin collection sound */
    coinSound = new Audio('audio/catch coin.wav');
    /** @type {HTMLAudioElement} - Win sound effect */
    winSound = new Audio('audio/win.mp3');
    /** @type {HTMLAudioElement} - Lose sound effect */
    loseSound = new Audio('audio/lose.wav');
    /** @type {Array<number>} - Game intervals array */
    intervals = [];
    /** @type {boolean} - Sound played status */
    soundPlayed = false;
    /** @type {number} - Last throw timestamp */
    lastThrowTime = 0; 

    /**
     * Creates a new World instance
     * @param {HTMLCanvasElement} canvas - The game canvas element
     * @param {Keyboard} keyboard - The keyboard input handler
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.gameOverImage.src = 'img/9_intro_outro_screens/game_over/oh no you lost!.png';
        this.gameWonImage.src = 'img/9_intro_outro_screens/win/won_2.png';
        this.draw();
        this.setWorld();
        this.setVolume(0.1);
    }

    /**
     * Sets the volume for all game audio elements
     * @param {number} volume - Volume level between 0 and 1
     * @returns {void}
     */
    setVolume(volume) {
        this.coinSound.volume = volume;
        this.winSound.volume = volume;
        this.loseSound.volume = volume;
        this.character.hurtSound.volume = volume;
        this.character.runSound.volume = volume;
        this.character.jumpSound.volume = volume;
        this.endboss.attackSound.volume = volume;
        this.throwableObjects.forEach(bottle => { if (bottle.splashSound) {bottle.splashSound.volume = volume;}});
    }

    /**
     * Initializes and starts all game components and animations
     * @returns {void}
     */
    startGame() {
        this.run();
        this.initializeCoins();
        this.initializeBottles();
        this.character.startAnimations();
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {enemy.startAnimations();
            } else if (enemy.startAnimations) {enemy.startAnimations();}
        });
    }

    /**
     * Sets the world reference in character
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Starts the main game loop
     */
    run(){
        let interval = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 100);
        this.intervals.push(interval);
    }

    /**
     * Stops all game intervals and animations
     */
    stopGame() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
        this.character.stopAllIntervals();
        this.level.enemies.forEach(enemy => { if (enemy.stopAllIntervals) {enemy.stopAllIntervals();}});
        if (this.endboss && this.endboss.stopAllIntervals) {this.endboss.stopAllIntervals();}
        this.throwableObjects = [];
        this.stopAllSounds();
    }

    /**
     * Stops all game sounds
     */
    stopAllSounds() {
        this.character.stopSounds();
        this.endboss.stopSounds();
        this.throwableObjects.forEach(bottle => bottle.stopSounds());
        this.stopMiscSounds();
    }

    /**
     * Stops miscellaneous game sounds
     */
    stopMiscSounds() {
        this.coinSound.pause();
        this.coinSound.currentTime = 0;
        this.winSound.pause();
        this.winSound.currentTime = 0;
        this.loseSound.pause();
        this.loseSound.currentTime = 0;
    }

    /**
     * Initializes random coin positions throughout the level
     */
    initializeCoins() {
        for (let i = 0; i < 10; i++) {
            let coin = new Coins();
            coin.x = 200 + Math.random() * 2000;
            coin.y = 120 + Math.random() * 100;
            this.coins.push(coin);
        }
    }

    /**
     * Creates and places collectible bottles in the level
     */
    initializeBottles() {
        for (let i = 0; i < 10; i++) {
            this.bottles.push(new StaticBottle());
        }
    }

    /**
     * Checks for keyboard input to throw objects
     * Only allows throwing if endboss is not in hurt state
     */
    checkThrowObjects() {
        const currentTime = new Date().getTime();
        if (this.keyboard.r && this.character.bottles > 0 && currentTime - this.lastThrowTime > 5000 && !this.endboss.isHurtState) {
            let throwPositionY = this.character.y + 100;
            let bottle = new ThrowableObject(this.character.x, throwPositionY);
            bottle.splashSound.muted = isMuted;
            this.throwableObjects.push(bottle);
            this.character.bottles -= 1;
            this.bottlebar.setPercentage(this.character.bottles);
            this.lastThrowTime = currentTime;
        }
    }

    /**
     * Checks all possible collision types between game objects
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {this.enemiesCollide(enemy);});
        this.coins.forEach((coin, index) => {this.coinCollide(coin, index);});
        this.bottles.forEach((bottle, index) => {this.bottleCollide(bottle, index);});
        this.throwableObjects.forEach((bottle, bottleIndex) => {this.throwableObjectsCollide(bottle, bottleIndex);});
    }

    /**
     * Handles collision detection and effects for throwable objects
     * @param {ThrowableObject} bottle - The thrown bottle object
     * @param {number} bottleIndex - Index of the bottle in throwableObjects array
     */
    throwableObjectsCollide(bottle, bottleIndex) {
        if (this.endboss.isColliding(bottle) && !bottle.hasDamaged) {
            bottle.splash();
            bottle.hasDamaged = true;
            this.endboss.hit();
            this.endbossStatusBar.setPercentage(this.endboss.energy);
        }
        if (bottle.y >= 350) {bottle.splash();}
        if (bottle.toDelete) {this.throwableObjects.splice(bottleIndex, 1);}
    }

    /**
     * Handles collision detection for collectible bottles
     * @param {StaticBottle} bottle - The collectible bottle
     * @param {number} index - Index in bottles array
     */
    bottleCollide(bottle, index) {
        if (this.character.isColliding(bottle)) {
            this.bottles.splice(index, 1);
            this.character.bottles += 1;
            this.bottlebar.setPercentage(this.character.bottles);
        }
    }

    /**
     * Handles coin collection collision detection
     * @param {Coins} coin - The coin object
     * @param {number} index - Index in coins array
     */
    coinCollide(coin, index) {
        if (this.character.isColliding(coin)) {
            this.coins.splice(index, 1);
            this.character.coins += 10;
            this.coinbar.setPercentage(this.character.coins);
            this.coinSound.play();
        }
    }

    /**
     * Handles enemy collision detection and effects
     * @param {Enemy} enemy - The enemy object to check collisions with
     */
    enemiesCollide(enemy) {
        if (this.character.isColliding(enemy)) {
            if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) && this.character.isFallingOn(enemy) && !enemy.isDead) {
                enemy.die();
                this.character.setImmunity();
            } else if (!((enemy instanceof Chicken || enemy instanceof ChickenSmall) && enemy.isDead)) {
                this.character.hit();
                this.statusbar.setPercentage(this.character.energy);
            }
        }
    }

    /**
     * Renders all game objects on the canvas
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);        
        this.ctx.save();
        this.drawGameObjects();
        this.ctx.restore();        
        if ((this.character.isDead() || this.endboss.isDead()) && !this.gameEndTimeout) {this.drawEndGameTimeout();}
        if (this.endScreenVisible) {this.drawEndScreenVisible();}    
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Renders game objects with proper camera translation
     */
    drawGameObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusbar);
        this.addToMap(this.coinbar);
        this.addToMap(this.bottlebar);
        if (this.character.x > this.endboss.x - 720) {this.addToMap(this.endbossStatusBar);}
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.endboss);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * Handles the game end timeout and cleanup
     */
    drawEndGameTimeout() {
        this.gameEndTimeout = true;
        setTimeout(() => {
            this.stopGame();
            this.endScreenVisible = true;
            showButtonContainer();
        }, 2000);
    }

    /**
     * Renders the appropriate end screen (win/lose)
     */
    drawEndScreenVisible() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.character.isDead()) { this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
            if (!this.soundPlayed) {
                this.loseSound.play();
                this.soundPlayed = true;
            }
        } else if (this.endboss.isDead()) {
            this.ctx.drawImage(this.gameWonImage, 0, 0, this.canvas.width, this.canvas.height);
            if (!this.soundPlayed) {
                this.winSound.play();
                this.soundPlayed = true;
            }
        }                
        document.querySelector('.mobile-controls').style.display = 'none';
    }
    /**
     * Translates the canvas context for camera movement
     */
    drawTranslate() {        
        this.ctx.translate(this.camera_x, 0);  
        this.ctx.translate(-this.camera_x, 0);        
        this.ctx.translate(this.camera_x, 0);
    }

    /**
     * Adds specific game objects to the map
     * @param {MovableObject} mo - The game object to render
     */
    drawAddToMap(mo){
        this.addToMap(this.character);
        this.addToMap(this.endboss);          
        this.addToMap(this.statusbar);
        this.addToMap(this.coinbar);
        this.addToMap(this.bottlebar);        
        if (this.character.x > this.endboss.x - 720) {this.addToMap(this.endbossStatusBar);}  
    }

    /**
     * Adds multiple game objects to the map
     */
    drawObjectToMap() {
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.throwableObjects);          
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);        
        this.addObjectsToMap(this.level.backgroundObjects);      
    }

    /**
     * Adds multiple objects to the game world
     * @param {MovableObject[]} objects - Array of game objects to render
     */
    addObjectsToMap(objects){
        objects.forEach(object => {this.addToMap(object);});
    }

    /**
     * Adds a single object to the game world
     * @param {MovableObject} mo - The game object to render
     */
    addToMap(mo){
        if(mo.otherDirection){this.flipImage(mo);}
        mo.draw(this.ctx);
        if(mo.otherDirection){this.flipImageBack(mo);}
    }

    /**
     * Flips an object's image horizontally
     * @param {MovableObject} mo - The object to flip
     */
    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the original image orientation
     * @param {MovableObject} mo - The object to restore
     */
    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}