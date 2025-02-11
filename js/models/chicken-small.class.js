/**
 * Class representing a small chicken enemy
 * @extends MoveableObject
 */
class ChickenSmall extends MoveableObject {
    /** @type {number} - Vertical position of the small chicken */
    y = 380;
    /** @type {number} - Height of the small chicken sprite */
    height = 50;
    /** @type {number} - Width of the small chicken sprite */
    width = 50;
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

    /**
     * Creates a new small chicken with random position and speed
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.images_walk);
        this.loadImages(this.images_dead);
        this.x = 720 + Math.random() * 500;  
        this.speed = 0.15 + Math.random() * 0.25;
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
}