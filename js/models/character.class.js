/**
 * Class representing the main playable character
 * @extends MoveableObject
 */
class Character extends MoveableObject {
    /** @type {number} - Height of character sprite */
    height = 240;
    /** @type {number} - Vertical position */
    y = 80;
    /** @type {number} - Movement speed */
    speed = 3;
    /** @type {number} - Collected coins counter */
    coins = 0;
    /** @type {number} - Collected bottles counter */
    bottles = 0;
    /** @type {boolean} - Immunity status */
    isImmune = false;
    /** @type {boolean} - Jump status */
    isJumping = false;
    /** @type {boolean} - Jump animation status */
    jumpAnimationRunning = false;

    /** @type {string[]} - Walking animation image paths */
    images_walk = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /** @type {string[]} - Jumping animation image paths */
    images_jumping = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];

    /** @type {string[]} - Death animation image paths */
    images_dead = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    /** @type {string[]} - Hurt animation image paths */
    images_hurt = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];

    /** @type {string[]} - Idle animation image paths */
    images_idle = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    /** @type {string[]} - Long idle animation image paths */
    images_longIdle = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    /** @type {World} - Reference to game world */
    world;
    /** @type {number} - Movement interval ID */
    movementInterval;
    /** @type {number} - Animation interval ID */
    animationInterval;
    /** @type {HTMLAudioElement} - Hurt sound effect */
    hurtSound = new Audio('audio/chatcter-hurt.mp3');
    /** @type {HTMLAudioElement} - Running sound effect */
    runSound = new Audio('audio/running.mp3');
    /** @type {HTMLAudioElement} - Jump sound effect */
    jumpSound = new Audio('audio/jump.mp3');
    /** @type {HTMLAudioElement} - Snoring sound effect */
    snoreSound = new Audio('audio/snoring.mp3')
    /** @type {number} - Timestamp of last movement */
    lastMove = new Date().getTime();
    /** @type {boolean} - Long idle state indicator */
    isLongIdle = false;
    /** @type {Object} - Collision offset values */
    offset = {
        top: 100,
        bottom: 10,
        left: 20,
        right: 20
    };

    /**
     * Creates a new Character instance and loads all required images
     */
    constructor(){
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.images_walk);
        this.loadImages(this.images_jumping);
        this.loadImages(this.images_dead);
        this.loadImages(this.images_hurt);
        this.loadImages(this.images_idle);
        this.loadImages(this.images_longIdle);
        this.apllyGravity();
    }

    /**
     * Starts character animations and movement intervals
     */
    startAnimations() {
        this.animate();
    }

    /**
     * Reduces character's energy when hit if not immune
     * Implements damage cooldown of 500ms
     */
    hit() {
        if (!this.isImmune) {
            let currentTime = new Date().getTime();
            if (currentTime - this.lastHit > 500) {
                this.energy -= 10;
                if (this.energy < 0) {
                    this.energy = 0;
                } else {
                    this.lastHit = currentTime;
                }
            }
        }
    }

    /**
     * Handles character movement based on keyboard input
     * Controls walking right/left and jumping
     */
    movement() {
        if (this.world.keyboard.right && this.x < 2200) {
            this.moveRightAndUpdate();
        }

        if (this.world.keyboard.left && this.x > 0) {
            this.moveLeftAndUpdate();
        }

        if (this.world.keyboard.space && !this.isAboveGround() && !this.isJumping) {
            this.jumpAndUpdate();
        }

        this.updateCameraPosition();
    }

    /**
     * Moves character right and updates the last movement timestamp
     */
    moveRightAndUpdate() {
        this.moveRight();
        this.updateLastMove();
    }

    /**
     * Moves character left and updates the last movement timestamp
     */
    moveLeftAndUpdate() {
        this.moveLeft();
        this.updateLastMove();
    }

    /**
     * Initiates jump movement and starts jump animation
     */
    jumpAndUpdate() {
        this.isJumping = true;
        this.jump();
        this.updateLastMove();
        if (!this.jumpAnimationRunning) {
            this.startJumpAnimation();
            this.jumpSound.play();
        }
    }

    /**
     * Handles the jump animation sequence
     * Plays animation frames and handles animation end
     */
    startJumpAnimation() {
        if (!this.jumpAnimationRunning) {
            this.jumpAnimationRunning = true;
            let i = 0;
            const jumpInterval = setInterval(() => {
                if (i >= this.images_jumping.length || !this.isAboveGround()) {
                    clearInterval(jumpInterval);
                    this.jumpAnimationRunning = false;
                    this.isJumping = false;
                } else {
                    this.img = this.imageCache[this.images_jumping[i]];
                    i++;
                }
            }, 100);
        }
    }

    /**
     * Updates the camera position relative to character position
     */
    updateCameraPosition() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Updates the timestamp of last movement and resets idle state
     */
    updateLastMove() {
        this.lastMove = new Date().getTime();
        this.isLongIdle = false;
    }

    /**
     * Handles all character animations based on current state
     * Controls death, hurt, and idle animations
     */
    animation() {
        if (this.isDead()) {
            this.handleDeathAnimation();
        } else if (this.isHurt()) {
            this.handleHurtAnimation();
        } else if (this.isAboveGround()) {
            return;
        } else {
            this.handleIdleOrWalkingAnimation();
        }
    }

    /**
     * Handles death animation sequence
     * Plays death animation and stops all intervals after completion
     */
    handleDeathAnimation() {
        let deathAnimationTime = this.images_dead.length * 100;
        this.playAnimation(this.images_dead);
        setTimeout(() => {
            this.stopAllIntervals();
            this.img = this.imageCache[this.images_dead[this.images_dead.length - 1]];
        }, deathAnimationTime);
    }

    /**
     * Handles hurt animation and plays hurt sound
     */
    handleHurtAnimation() {
        this.playAnimation(this.images_hurt);
        this.hurtSound.play();
    }

    /**
     * Handles walking and idle animations based on keyboard input
     */
    handleIdleOrWalkingAnimation() {
        if (this.isAboveGround()) {
            return;
        }
        if (this.world.keyboard.right || this.world.keyboard.left) {
            this.playAnimation(this.images_walk);
            this.runSound.play();
        } else {
            this.handleIdleAnimation();
        }
    }

    /**
     * Handles idle animations with different states based on idle duration
     * Switches between normal idle and long idle animations
     */
    handleIdleAnimation() {
        const idleTime = new Date().getTime() - this.lastMove;
        if (idleTime > 3000) {
            this.playAnimation(this.images_longIdle);
            if (!this.isLongIdle) {
                this.isLongIdle = true;
                this.snoreSound.play();
            }
        } else if (idleTime > 1000) {
            this.playAnimation(this.images_idle);
        }
    }

    /**
     * Initializes and starts animation and movement intervals
     */
    animate() {

        this.movementInterval = setInterval(() => {
            this.movement();
        }, 1000/60);

        this.animationInterval = setInterval(() => {
            this.animation();
        }, 90);
    }

    /**
     * Stops all running animation and movement intervals
     */
    stopAllIntervals() {
        clearInterval(this.animationInterval);
        clearInterval(this.movementInterval);
    }

    /**
     * Makes the character jump by setting vertical speed
     */
    jump() {
        this.speedY = 25;
    }

    /**
     * Makes the character temporarily immune to damage
     * Immunity lasts for 500ms
     */
    setImmunity() {
        this.isImmune = true;
        setTimeout(() => {
            this.isImmune = false;
        }, 500);
    }

    /**
     * Sets the world reference and updates sound volumes
     * @param {World} world - The game world instance
     */
    setWorld(world) {
        this.world = world;
        const volume = world.coinSound.volume;
        this.hurtSound.volume = volume;
        this.runSound.volume = volume;
        this.jumpSound.volume = volume;
    }

    /**
     * Stops all character-related sound effects
     * Resets sound playback to beginning
     */
    stopSounds() {
        this.hurtSound.pause();
        this.hurtSound.currentTime = 0;
        this.runSound.pause();
        this.runSound.currentTime = 0;
        this.jumpSound.pause();
        this.jumpSound.currentTime = 0;
        this.snoreSound.pause();
        this.snoreSound.currentTime = 0;
    }
}