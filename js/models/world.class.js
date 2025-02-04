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
    endboss = new Endboss();
    endbossStatusBar = new EndbossStatusBar();

    constructor(canvas , keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.initializeCoins();
        this.initializeBottles();
        this.coinbar =  new CoinBar();
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
            let bottle = new Bottles();
            bottle.x = 200 + Math.random() * 2000;
            this.bottles.push(bottle);
        }
    }

    checkThrowObjects(){
        if(this.keyboard.r && this.character.bottles > 0){
            let bottle = new ThrowableObject(this.character.x, this.character.y);
            this.throwableObjects.push(bottle);
            this.character.bottles -= 1;
            this.bottlebar.setPercentage(this.character.bottles);
        }
    }

    checkCollisions(){
        this.level.enemies.forEach(enemy => {
            if(this.character.isColliding(enemy)){
                this.character.hit();
                this.statusbar.setPercentage(this.character.energy);
            }
        });

        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1);
                this.character.coins += 10;
                this.coinbar.setPercentage(this.character.coins);
            }
        });

        this.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.bottles.splice(index, 1);
                this.character.bottles += 1;
                this.bottlebar.setPercentage(this.character.bottles);
            }
        });

        this.throwableObjects.forEach((bottle, bottleIndex) => {
            if (this.endboss.isColliding(bottle)) {
                this.endboss.hit();
                this.endbossStatusBar.setPercentage(this.endboss.energy);
                this.throwableObjects.splice(bottleIndex, 1);
            }
        });
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
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.throwableObjects);
    
        this.ctx.restore();
    
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
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