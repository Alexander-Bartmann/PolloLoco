/**
 * Class representing a throwable object (bottle) in the game
 * @extends MoveableObject
 */
class ThrowableObject extends MoveableObject {
    /** @type {string[]} - Array of bottle rotation image paths */
    images_bottleThrow = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    /** @type {string[]} - Array of bottle splash animation image paths */
    images_bottleSplash = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /** @type {boolean} - Indicates if bottle is currently splashing */
    isSplashing = false;
    /** @type {boolean} - Indicates if bottle has caused damage */
    hasDamaged = false;
    /** @type {number} - Interval ID for throw animation */
    throwInterval; 
    /** @type {HTMLAudioElement} - Sound effect for bottle breaking */
    splashSound = new Audio('audio/bottle break.mp3'); 
    /** @type {Object} - Collision offset values */
    offset = {
        top: 10,     
        bottom: 10,   
        left: 10,     
        right: 10     
    };

    /**
     * Creates a new throwable object
     * @param {number} x - Initial X position
     * @param {number} y - Initial Y position
     * @param {boolean} otherDirection - Throw direction (true = left, false = right)
     */
    constructor(x, y, otherDirection) {  // Parameter otherDirection hinzugefügt
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.images_bottleThrow);
        this.loadImages(this.images_bottleSplash);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;  // Speichern der Wurfrichtung
        this.throw();
        this.animate();
        this.splashSound.muted = isMuted;
    }

    /**
     * Initiates the throwing motion of the bottle
     */
    throw() {
        this.speedY = 25;
        this.apllyGravity();
        this.throwInterval = setInterval(() => {
            if (!this.isSplashing) {
                if (this.otherDirection) {
                    this.x -= 10;  // Nach links werfen
                } else {
                    this.x += 10;  // Nach rechts werfen
                }
            }
        }, 25);
    }

    /**
     * Handles the animation of the bottle (rotation and splash)
     */
    animate() {
        setInterval(() => {
            if (this.isSplashing) {
                this.playAnimationOnce(this.images_bottleSplash, () => {
                    
                    this.toDelete = true;
                });
            } else {
                this.playAnimation(this.images_bottleThrow);
            }
        }, 50);
    }

    /**
     * Triggers the splash animation and sound effect
     */
    splash() {
        this.isSplashing = true;
        this.speedY = 0;
        if (!isMuted) {
            this.splashSound.play();
        }
        clearInterval(this.throwInterval);
    }

    /**
     * Stops the splash sound of the bottle
     */
    stopSounds() {
        if (this.splashSound) {
            this.splashSound.pause();
            this.splashSound.currentTime = 0;
        }
    }

    /**
     * Applies gravity effect to the bottle's movement
     */
    apllyGravity() {
        setInterval(() => {
            if(!this.isSplashing && (this.isAboveGround() || this.speedY > 0)) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000/25);
    }
}