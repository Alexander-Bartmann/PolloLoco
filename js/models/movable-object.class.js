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

    isColliding(mo) {
        return this.x + this.width - (this.offset?.right || 0) > mo.x + (mo.offset?.left || 0) &&
               this.y + this.height - (this.offset?.bottom || 0) > mo.y + (mo.offset?.top || 0) &&
               this.x + (this.offset?.left || 0) < mo.x + mo.width - (mo.offset?.right || 0) &&
               this.y + (this.offset?.top || 0) < mo.y + mo.height - (mo.offset?.bottom || 0);
    }

    isAboveX(mo) {
        return this.x + this.width >= mo.x && this.x <= mo.x + mo.width;
    }

    isAbove(mo) {
        return this.y + this.height <= mo.y + mo.height / 2;
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