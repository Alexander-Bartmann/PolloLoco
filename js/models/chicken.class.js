/**
 * Class representing a normal chicken enemy
 * @extends MoveableObject
 */
class Chicken extends MoveableObject {
    /** @type {number} - Vertical position of the chicken */
    y = 350;
    /** @type {number} - Height of the chicken sprite */
    height = 80;
    /** @type {number} - Width of the chicken sprite */
    width = 80;
    /** @type {boolean} - Indicates if chicken is dead */
    isDead = false;
    /** @type {string[]} - Walking animation image paths */
    images_walk = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    
    /** @type {string[]} - Dead state image path */
    images_dead = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];
    /** @type {HTMLAudioElement} - Sound effect for chicken death */
    dieSound = new Audio('audio/chicken-dead.mp3'); 

    /**
     * Creates a new chicken with random position and speed
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.images_walk);
        this.loadImages(this.images_dead);
        this.x = 720 + Math.random() * 500;  
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();      
    }

    /**
     * Starts the chicken's movement and animation
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
     * Handles the death state of the chicken
     */
    die() {
        this.isDead = true;
        this.img = this.imageCache[this.images_dead[0]];
        this.dieSound.play();
    }
}