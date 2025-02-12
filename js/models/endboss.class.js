/**
 * Class representing the end boss enemy
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {
    /** @type {number} - Height of the boss sprite */
    height = 400;
    /** @type {number} - Width of the boss sprite */
    width = 300;
    /** @type {number} - Vertical position */
    y = 45;
    /** @type {number} - Movement speed */
    speed = 0.3;
    /** @type {boolean} - Indicates if boss is in hurt timeout */
    hurtTimeout = false;
    /** @type {boolean} - Indicates if boss is attacking */
    isAttacking = false;
    /** @type {boolean} - Indicates if attack is in cooldown */
    attackCooldown = false;
    /** @type {Object} - Collision offset values */
    offset = {
        top: 50,
        bottom: 10,
        left: 40,
        right: 40
    };

    /** @type {string[]} - Walking animation image paths */
    images_walk = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    /** @type {string[]} - Alert animation image paths */
    images_alert = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    /** @type {string[]} - Attack animation image paths */
    images_attack = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    /** @type {string[]} - Hurt animation image paths */
    images_hurt = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    /** @type {string[]} - Death animation image paths */
    images_dead = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /** @type {number} - Animation interval ID */
    animationInterval;
    /** @type {number} - Movement interval ID */
    movementInterval;
    /** @type {HTMLAudioElement} - Attack sound effect */
    attackSound = new Audio('audio/chicken-attack.mp3');

    /**
     * Creates a new Endboss instance and loads all required images
     */
    constructor() {
        super();
        this.loadImages(this.images_walk);
        this.loadImages(this.images_alert);
        this.loadImages(this.images_attack);
        this.loadImages(this.images_hurt);
        this.loadImages(this.images_dead);     
        this.img = this.imageCache[this.images_walk[0]];        
        this.x = 2500;
    }

    /**
     * Starts all boss animations
     */
    startAnimations() {
        this.animate();
    }

    /**
     * Initializes all animation and movement intervals
     */
    animate() {
        this.startAnimationInterval();
        this.startMovementInterval();
        this.startAttackInterval();
    }

    /**
     * Starts the main animation interval for different states
     */
    startAnimationInterval() {
        this.animationInterval = setInterval(() => {
            if (this.isDead()) {
                this.handleDeathAnimation();
            } else if (this.isHurt()) {
                this.handleHurtAnimation();
            } else if (this.isAttacking) {
                this.playAnimation(this.images_attack);
            } else if (this.alert) {
                this.playAnimation(this.images_alert);
            } else {
                this.playAnimation(this.images_walk);
            }
        }, 200);
    }

    /**
     * Starts the movement interval
     */
    startMovementInterval() {
        this.movementInterval = setInterval(() => {
            if (!this.isDead() && !this.hurtTimeout) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
    }

    /**
     * Starts the attack interval that controls attack timing
     */
    startAttackInterval() {
        setInterval(() => {
            if (!this.isDead() && !this.isHurt() && !this.attackCooldown) {
                this.startAttack();
            }
        }, 1000); 
    }

    /**
     * Initiates an attack sequence with cooldown
     */
    startAttack() {
        this.isAttacking = true;
        this.attackCooldown = true;
        this.attackSound.play();
        
        setTimeout(() => {
            this.isAttacking = false;
        }, 1600);

        setTimeout(() => {
            this.attackCooldown = false;
        }, 8000);
    }

    /**
     * Handles the death animation sequence
     */
    handleDeathAnimation() {
        let deathAnimationTime = this.images_dead.length * 200;
        this.playAnimation(this.images_dead);
        setTimeout(() => {
            this.stopAllIntervals();
            this.img = this.imageCache[this.images_dead[this.images_dead.length - 1]];
        }, deathAnimationTime);
    }

    /**
     * Handles the hurt animation sequence
     */
    handleHurtAnimation() {
        this.playAnimationOnce(this.images_hurt, () => {
            this.playAnimation(this.images_walk);
        });
        this.stopMovement();
    }

    /**
     * Stops all animation and movement intervals
     */
    stopAllIntervals() {
        clearInterval(this.animationInterval);
        clearInterval(this.movementInterval);
    }

    /**
     * Temporarily stops boss movement
     */
    stopMovement() {
        this.hurtTimeout = true;
        setTimeout(() => {
            this.hurtTimeout = false;
        }, 1500);
    }

    /**
     * Checks if the endboss is dead
     * @returns {boolean} True if energy is 0, false otherwise
     */
    isDead() {
        return this.energy <= 0;
    }
}