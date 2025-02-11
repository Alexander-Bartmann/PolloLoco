/**
 * Represents the game world containing all game objects and logic
 * @class
 */
class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusbar = new StatusBar();
    coinbar = new CoinBar();
    bottlebar = new BottleBar();
    throwableObjects = [];
    coins = [];
    bottles = [];
    endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    endbossStatusBar = new EndbossStatusBar();
    gameOverImage = new Image();
    gameWonImage = new Image();
    gameEndTimeout = false;
    endScreenVisible = false;
    coinSound = new Audio('audio/catch coin.wav');
    winSound = new Audio('audio/win.mp3');
    loseSound = new Audio('audio/lose.wav');
    intervals = [];

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
        this.createRestartButton();
        this.draw();
        this.setWorld();
        this.setVolume(0.1);
    }

    /**
     * Sets the volume for all game sounds
     * @param {number} volume - Volume level between 0 and 1
     */
    setVolume(volume) {
        this.coinSound.volume = volume;
        this.winSound.volume = volume;
        this.loseSound.volume = volume;
        this.character.hurtSound.volume = volume;
        this.character.runSound.volume = volume;
        this.character.jumpSound.volume = volume;
        this.endboss.attackSound.volume = volume;
        this.throwableObjects.forEach(bottle => {
            if (bottle.splashSound) {
                bottle.splashSound.volume = volume;
            }
        });
    }

    /**
     * Creates and initializes the restart button
     */
    createRestartButton() {
        this.restartButton = document.createElement('button');
        this.restartButton.id = 'restartButton';
        this.restartButton.className = 'restartButton';
        this.restartButton.innerHTML = 'Restart Game';
        this.restartButton.onclick = () => location.reload();
        this.restartButton.style.display = 'none';
        document.getElementById('gameContainer').appendChild(this.restartButton);
    }

    /**
     * Starts all game animations and intervals
     */
    startGame() {
        this.run();
        this.initializeCoins();
        this.initializeBottles();
        this.character.startAnimations();
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.startAnimations();
            } else if (enemy.startAnimations) {
                enemy.startAnimations();
            }
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
        this.level.enemies.forEach(enemy => {
            if (enemy.stopAllIntervals) {
                enemy.stopAllIntervals();
            }
        });
        if (this.endboss && this.endboss.stopAllIntervals) {
            this.endboss.stopAllIntervals();
        }
        this.throwableObjects = [];
    }

    /**
     * Initializes coins with random positions
     */
    initializeCoins() {
        for (let i = 0; i < 10; i++) {
            let coin = new Coins();
            coin.x = 200 + Math.random() * 2000;
            coin.y = 50 + Math.random() * 100;
            this.coins.push(coin);
        }
    }

    /**
     * Initializes collectible bottles
     */
    initializeBottles() {
        for (let i = 0; i < 20; i++) {
            this.bottles.push(new StaticBottle());
        }
    }

    /**
     * Checks if objects should be thrown
     */
    checkThrowObjects(){
        if(this.keyboard.r && this.character.bottles > 0){
            let bottle = new ThrowableObject(this.character.x, this.character.y);
            bottle.splashSound.muted = isMuted;
            this.throwableObjects.push(bottle);
            this.character.bottles -= 1;
            this.bottlebar.setPercentage(this.character.bottles);
        }
    }

    /**
     * Checks all collision types in the game
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            this.enemiesCollide(enemy);
        });
        this.coins.forEach((coin, index) => {
            this.coinCollide(coin, index);
        });
        this.bottles.forEach((bottle, index) => {
            this.bottleCollide(bottle, index);
        });
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.throwableObjectsCollide(bottle, bottleIndex);
        });
    }

    /**
     * Handles collisions with throwable objects
     * @param {ThrowableObject} bottle - The thrown bottle
     * @param {number} bottleIndex - Index in throwableObjects array
     */
    throwableObjectsCollide(bottle, bottleIndex) {
        if (this.endboss.isColliding(bottle) && !bottle.hasDamaged) {
            bottle.splash();
            bottle.hasDamaged = true;
            this.endboss.hit();
            this.endbossStatusBar.setPercentage(this.endboss.energy);
        }
        if (bottle.y >= 350) {
            bottle.splash();
        }
        if (bottle.toDelete) {
            this.throwableObjects.splice(bottleIndex, 1);
        }
    }

    /**
     * Handles collisions with collectible bottles
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
     * Handles collisions with coins
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
     * Handles collisions with enemies
     * @param {Enemy} enemy - The enemy object
     */
    enemiesCollide(enemy) {
        if (this.character.isColliding(enemy)) {
            if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) && this.character.isAbove(enemy)) {
                enemy.die();
                this.character.isImmune = true;
                setTimeout(() => {
                    this.character.isImmune = false;
                }, 500);
            } else if (!((enemy instanceof Chicken || enemy instanceof ChickenSmall) && enemy.isDead)) {
                this.character.hit();
                this.statusbar.setPercentage(this.character.energy);
            }
        }
    }

    /**
     * Draws all game objects to the canvas
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);        
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);    
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusbar);
        this.addToMap(this.coinbar);
        this.addToMap(this.bottlebar);
        if (this.character.x > this.endboss.x - 720) {
            this.addToMap(this.endbossStatusBar);
        }    
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.endboss);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.throwableObjects);    
        this.ctx.restore();
        if ((this.character.isDead() || this.endboss.isDead()) && !this.gameEndTimeout) {
            this.gameEndTimeout = true;
            setTimeout(() => {
                this.endScreenVisible = true;
            }, 2000);
        }
        if (this.endScreenVisible) {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.character.isDead()) {
                this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
                this.loseSound.play();
            } else if (this.endboss.isDead()) {
                this.ctx.drawImage(this.gameWonImage, 0, 0, this.canvas.width, this.canvas.height);
                this.winSound.play();
            }
            setTimeout(() => {
                this.restartButton.style.display = 'block';
            }, 2000);
            document.querySelector('.mobile-controls').style.display = 'none';
        }
    
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Adds multiple objects to the map
     * @param {MovableObject[]} objects - Array of objects to draw
     */
    addObjectsToMap(objects){
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * Adds a single object to the map
     * @param {MovableObject} mo - The object to draw
     */
    addToMap(mo){
        if(mo.otherDirection){
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if(mo.otherDirection){            
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips an image horizontally
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