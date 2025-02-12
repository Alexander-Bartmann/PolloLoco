/**
 * Base class for all movable game objects
 * @extends DrawableObject
 */
class MoveableObject extends DrawableObject {
    /** @type {number} - Movement speed of the object */
    speed = 0.20;
    /** @type {boolean} - Indicates if object is facing opposite direction */
    otherDirection = false;
    /** @type {number} - Vertical speed for jumping/falling */
    speedY = 0;
    /** @type {number} - Gravity acceleration */
    acceleration = 2;
    /** @type {number} - Health/energy level */
    energy = 100;
    /** @type {number} - Timestamp of last hit */
    lastHit = 0;

    /**
     * Applies gravity effect to the object
     */
    apllyGravity() {
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000/25);
    }

    /**
     * Checks if object is above ground level
     * @returns {boolean} True if object is above ground or is throwable
     */
    isAboveGround(){
        if(this instanceof ThrowableObject){
            return true;
        } else {
            return this.y < 180;
        }
    }

    /**
     * Checks if this object is colliding with another object
     * @param {MoveableObject} mo - The object to check collision with
     * @returns {boolean} True if objects are colliding
     */
    isColliding(mo) {
        return this.x + this.width - (this.offset?.right || 0) > mo.x + (mo.offset?.left || 0) &&
               this.y + this.height - (this.offset?.bottom || 0) > mo.y + (mo.offset?.top || 0) &&
               this.x + (this.offset?.left || 0) < mo.x + mo.width - (mo.offset?.right || 0) &&
               this.y + (this.offset?.top || 0) < mo.y + mo.height - (mo.offset?.bottom || 0);
    }

    /**
     * Checks if this object is above another object on X-axis
     * @param {MoveableObject} mo - The object to check against
     * @returns {boolean} True if this object is above on X-axis
     */
    isAboveX(mo) {
        return this.x + this.width >= mo.x && this.x <= mo.x + mo.width;
    }

    /**
     * Checks if this object is vertically above another object
     * @param {MoveableObject} mo - The object to check against
     * @returns {boolean} True if this object is above
     */
    isAbove(mo) {
        return this.y + this.height <= mo.y + mo.height / 2;
    }

    /**
     * Reduces object's energy when hit
     */
    hit() {
        this.energy -= 20;
        if(this.energy < 0){
            this.energy = 0;
        } else{
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if object is in hurt state
     * @returns {boolean} True if object was recently hit
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return (timepassed / 1000) < 1.5;
    }
    

    /**
     * Checks if object has no energy left
     * @returns {boolean} True if energy is 0
     */
    isDead(){
        return this.energy == 0;
    }

    /**
     * Plays a looping animation from an array of images
     * @param {string[]} images - Array of image paths to animate
     */
    playAnimation(images) {        
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Plays an animation once and executes callback when complete
     * @param {string[]} images - Array of image paths to animate
     * @param {Function} callback - Function to call when animation completes
     */
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
    

    /**
     * Moves object to the right
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Moves object to the left
     */
    moveLeft(){
        this.x -= this.speed;
        this.otherDirection = true;
    }

    /**
     * Makes object jump by setting vertical speed
     */
    jump() {
        this.speedY = 30;
    }
}