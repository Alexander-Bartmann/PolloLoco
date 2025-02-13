/**
 * Class representing a small chicken enemy
 * @extends MoveableObject
 */
class ChickenSmall extends MoveableObject {
    /** @type {number} - Vertical position of the small chicken */
    y = 370;
    /** @type {number} - Height of the small chicken sprite */
    height = 60;
    /** @type {number} - Width of the small chicken sprite */
    width = 60;
    /** @type {boolean} - Indicates if chicken is dead */
    isDead = false;
    /** @type {string[]} - Walking animation image paths */
    images_walk = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    
    /** @type {string[]} - Dead state image path */
    images_dead = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /** @type {Object} - Collision offset values to make hit detection more forgiving */
    offset = {
        top: -20,  
        bottom: 10,
        left: -15,
        right: -15
    };

    /**
     * Creates a new small chicken with random position and speed
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.images_walk);
        this.loadImages(this.images_dead);
        this.x = 720 + Math.random() * 500;  
        this.speed = 0.15 + Math.random() * 0.25;
        this.y = 370;
        this.animate();      
    }

    /**
     * Starts the small chicken's movement and animation
     */
    animate() {
        setInterval(() => {
            if (!this.isDead) {
                this.x -= this.speed;
            }
        }, 1000/60);
        
        setInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.images_walk);
            }
        }, 200);
    }

    /**
     * Handles the death state of the small chicken
     */
    die() {
        this.isDead = true;
        this.img = this.imageCache[this.images_dead[0]];
    }

    /**
     * Checks if the chicken is hit from above and dies
     * @param {MoveableObject} mo - The object to check collision with
     */
    checkIfHitFromAbove(mo) {
        if (mo.isFallingOn(this)) {
            this.die();
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
     * Checks if this object is falling onto another object
     * @param {MoveableObject} mo - The object to check against
     * @returns {boolean} True if object is falling onto the other object
     */
    isFallingOn(mo) {
        return this.isAboveX(mo) && 
               this.isAbove(mo) && 
               this.speedY > 0;
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
        return this.y + this.height <= mo.y + mo.height / 1.5;
    }
}