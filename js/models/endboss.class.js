class Endboss extends MoveableObject {

    height = 400;
    width = 300;
    y = 45;
    speed = 0.3;
    hurtTimeout = false;
    isAttacking = false;
    attackCooldown = false;
    offset = {
        top: 50,
        bottom: 10,
        left: 40,
        right: 40
    };

    images_walk = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

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

    images_hurt = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    images_dead = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    animationInterval;
    movementInterval;
    attackSound = new Audio('audio/chicken-attack.mp3');

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

    startAnimations() {
        this.animate();
    }

    animate() {
        this.startAnimationInterval();
        this.startMovementInterval();
        this.startAttackInterval();
    }

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

    startMovementInterval() {
        this.movementInterval = setInterval(() => {
            if (!this.isDead() && !this.hurtTimeout) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
    }

    startAttackInterval() {
        setInterval(() => {
            if (!this.isDead() && !this.isHurt() && !this.attackCooldown) {
                this.startAttack();
            }
        }, 1000); 
    }

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

    handleDeathAnimation() {
        let deathAnimationTime = this.images_dead.length * 200;
        this.playAnimation(this.images_dead);
        setTimeout(() => {
            this.stopAllIntervals();
            this.img = this.imageCache[this.images_dead[this.images_dead.length - 1]];
        }, deathAnimationTime);
    }

    handleHurtAnimation() {
        this.playAnimationOnce(this.images_hurt, () => {
            this.playAnimation(this.images_walk);
        });
        this.stopMovement();
    }

    stopAllIntervals() {
        clearInterval(this.animationInterval);
        clearInterval(this.movementInterval);
    }

    stopMovement() {
        this.hurtTimeout = true;
        setTimeout(() => {
            this.hurtTimeout = false;
        }, 1500);
    }
}