class MoveableObject extends DrawableObject {
    speed = 0.20;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    lastHit = 0;

    apllyGravity() {
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000/25);
    }

    isAboveGround(){
        if(this instanceof ThrowableObject){
            return true;
        } else {
            return this.y < 180;
        }
    }

    isColliding(mo){
        return this.x + this.width > mo.x &&
               this.y + this.height > mo.y &&
               this.x < mo.x &&
               this.y < mo.height + mo.y;    
    }


    isAboveX(mo) {
        return this.x + this.width >= mo.x && this.x <= mo.x + mo.width;
    }

    isAbove(mo) {
        return this.y + this.height >= mo.y && this.y <= mo.y + mo.height;
    }

    hit() {
        this.energy -= 10;
        if(this.energy < 0){
            this.energy = 0;
        } else{
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return (timepassed / 1000) < 1.5;
    }
    

    isDead(){
        return this.energy == 0;
    }

    playAnimation(images) {        
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    playAnimationOnce(images, callback) {
        let i = 0;
        let interval = setInterval(() => {
            this.img = this.imageCache[images[i]];
            i++;
            if (i >= images.length) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 100);
    }
    

    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft(){
        this.x -= this.speed;
        this.otherDirection = true;
    }

    jump() {
        this.speedY = 30;
    }
}