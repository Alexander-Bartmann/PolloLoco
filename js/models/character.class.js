class Character extends MoveableObject{
    height = 240;
    y = 80;
    speed = 10;
    coins = 0;
    bottles = 0;
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
    world;
    movementInterval;
    animationInterval;

    constructor(){
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.images_walk);
        this.loadImages(this.images_jumping);
        this.loadImages(this.images_dead);
        this.loadImages(this.images_hurt);
        this.apllyGravity();
    }

    startAnimations() {
        this.animate();
    }

    hit() {
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

    animate() {

        this.movementInterval = setInterval(() => {
            if(this.world.keyboard.right && this.x < this.world.level.level_end_x){
                this.moveRight();
            }

            if(this.world.keyboard.left && this.x > 0){
                this.moveLeft();
            }

            if(this.world.keyboard.space && !this.isAboveGround()){
                this.jump();
            } 

            this.world.camera_x = -this.x + 100; 
        }, 1000/60);

        this.animationInterval = setInterval(() => {
            if(this.isDead()){
                let deathAnimationTime = this.images_dead.length * 100; // Schnellere Animation als Endboss
                this.playAnimation(this.images_dead);
                setTimeout(() => {
                    this.stopAllIntervals();
                    this.img = this.imageCache[this.images_dead[this.images_dead.length - 1]];
                }, deathAnimationTime);
            } else if (this.isHurt()){
                this.playAnimation(this.images_hurt);
            } else if(this.isAboveGround()){
                this.playAnimation(this.images_jumping);
            } else {
                if(this.world.keyboard.right || this.world.keyboard.left){
                    this.playAnimation(this.images_walk);
                }
            }            
        }, 30);
    }

    stopAllIntervals() {
        clearInterval(this.animationInterval);
        clearInterval(this.movementInterval);
    }

    jump() {
        this.speedY = 25;
    }
}