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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.gameOverImage.src = 'img/9_intro_outro_screens/game_over/oh no you lost!.png';
        this.gameWonImage.src = 'img/9_intro_outro_screens/win/won_2.png';
        this.createRestartButton();
        this.draw();
        this.setWorld();
    }

    createRestartButton() {
        this.restartButton = document.createElement('button');
        this.restartButton.id = 'restartButton';
        this.restartButton.className = 'restartButton';
        this.restartButton.innerHTML = 'Restart Game';
        this.restartButton.onclick = () => location.reload();
        this.restartButton.style.display = 'none';
        document.getElementById('gameContainer').appendChild(this.restartButton);
    }

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

    setWorld() {
        this.character.world = this;
    }

    run(){
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 100);
    }

    initializeCoins() {
        for (let i = 0; i < 10; i++) {
            let coin = new Coins();
            coin.x = 200 + Math.random() * 2000;
            coin.y = 50 + Math.random() * 100;
            this.coins.push(coin);
        }
    }

    initializeBottles() {
        for (let i = 0; i < 20; i++) {
            this.bottles.push(new StaticBottle());
        }
    }

    checkThrowObjects(){
        if(this.keyboard.r && this.character.bottles > 0){
            let bottle = new ThrowableObject(this.character.x, this.character.y);
            bottle.splashSound.muted = isMuted;
            this.throwableObjects.push(bottle);
            this.character.bottles -= 1;
            this.bottlebar.setPercentage(this.character.bottles);
        }
    }

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

    bottleCollide(bottle, index) {
        if (this.character.isColliding(bottle)) {
            this.bottles.splice(index, 1);
            this.character.bottles += 1;
            this.bottlebar.setPercentage(this.character.bottles);
        }
    }

    coinCollide(coin, index) {
        if (this.character.isColliding(coin)) {
            this.coins.splice(index, 1);
            this.character.coins += 10;
            this.coinbar.setPercentage(this.character.coins);
            this.coinSound.play();
        }
    }

    enemiesCollide(enemy) {
        if (this.character.isColliding(enemy)) {
            if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) && this.character.isAbove(enemy)) {
                enemy.die();
            } else if (!((enemy instanceof Chicken || enemy instanceof ChickenSmall) && enemy.isDead)) {
                this.character.hit();
                this.statusbar.setPercentage(this.character.energy);
            }
        }
    }

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

    addObjectsToMap(objects){
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(mo){
        if(mo.otherDirection){
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if(mo.otherDirection){
            
            this.flipImageBack(mo);
        }
    }

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}