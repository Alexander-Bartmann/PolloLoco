class ChickenSmall extends MoveableObject {
    y = 380;
    height = 50;
    width = 50;
    isDead = false;
    images_walk = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    
    images_dead = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.images_walk);
        this.loadImages(this.images_dead);
        this.x = 720 + Math.random() * 500;  
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();      
    }

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

    die() {
        this.isDead = true;
        this.img = this.imageCache[this.images_dead[0]];
    }
}