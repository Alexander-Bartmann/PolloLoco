/**
 * Class representing the main playable character
 * @extends MoveableObject
 */
class Character extends MoveableObject{
    height = 240;
    y = 80;
    speed = 3;
    coins = 0;
    bottles = 0;
    isImmune = false;
    images_walk = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

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

    images_dead = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    images_hurt = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];

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

    world;
    movementInterval;
    animationInterval;
    hurtSound = new Audio('audio/chatcter-hurt.mp3');
    runSound = new Audio('audio/running.mp3');
    jumpSound = new Audio('audio/jump.mp3');
    /** @type {number} - Timestamp of last movement */
    lastMove = new Date().getTime();
    /** @type {boolean} - Indicates if character is in long idle state */
    isLongIdle = false;
    offset = {
        top: 120,
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
     */
    movement() {
        if (this.world.keyboard.right && this.x < this.world.level.level_end_x) {
            this.moveRightAndUpdate();
        }

        if (this.world.keyboard.left && this.x > 0) {
            this.moveLeftAndUpdate();
        }

        if (this.world.keyboard.space && !this.isAboveGround()) {
            this.jumpAndUpdate();
        }

        this.updateCameraPosition();
    }

    moveRightAndUpdate() {
        this.moveRight();
        this.updateLastMove();
    }

    moveLeftAndUpdate() {
        this.moveLeft();
        this.updateLastMove();
    }

    jumpAndUpdate() {
        this.jump();
        this.updateLastMove();
    }

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
     */
    animation() {
        if (this.isDead()) {
            this.handleDeathAnimation();
        } else if (this.isHurt()) {
            this.handleHurtAnimation();
        } else if (this.isAboveGround()) {
            this.handleJumpingAnimation();
        } else {
            this.handleIdleOrWalkingAnimation();
        }
    }

    handleDeathAnimation() {
        let deathAnimationTime = this.images_dead.length * 100;
        this.playAnimation(this.images_dead);
        setTimeout(() => {
            this.stopAllIntervals();
            this.img = this.imageCache[this.images_dead[this.images_dead.length - 1]];
        }, deathAnimationTime);
    }

    handleHurtAnimation() {
        this.playAnimation(this.images_hurt);
        this.hurtSound.play();
    }

    handleJumpingAnimation() {
        this.playAnimation(this.images_jumping);
        this.jumpSound.play();
    }

    handleIdleOrWalkingAnimation() {
        if (this.world.keyboard.right || this.world.keyboard.left) {
            this.playAnimation(this.images_walk);
            this.runSound.play();
        } else {
            this.handleIdleAnimation();
        }
    }

    handleIdleAnimation() {
        const idleTime = new Date().getTime() - this.lastMove;
        if (idleTime > 10000) {
            this.playAnimation(this.images_longIdle);
            if (!this.isLongIdle) {
                this.isLongIdle = true;
            }
        } else if (idleTime > 3000) {
            this.playAnimation(this.images_idle);
        }
    }

    /**
     * Initializes animation and movement intervals
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
     * Stops all running intervals
     */
    stopAllIntervals() {
        clearInterval(this.animationInterval);
        clearInterval(this.movementInterval);
    }

    /**
     * Makes the character jump
     */
    jump() {
        this.speedY = 25;
    }

    /**
     * Makes the character temporarily immune to damage
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
}