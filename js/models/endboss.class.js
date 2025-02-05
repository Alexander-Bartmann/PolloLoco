class Endboss extends MoveableObject {

    height = 400;
    width = 300;
    y = 45;
    speed = 0.3;

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

    constructor() {
        super();
        this.loadImages(this.images_walk);
        this.loadImages(this.images_alert);
        this.loadImages(this.images_attack);
        this.loadImages(this.images_hurt);
        this.loadImages(this.images_dead);
        
        this.img = this.imageCache[this.images_walk[0]];
        
        this.x = 2200;
        this.animate();
    }
    

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                console.log('Endboss is dead');
                this.playAnimation(this.images_dead);
            } else if (this.isHurt()) {
                console.log('Endboss is hurt');
                this.playAnimationOnce(this.images_hurt, () => {
                    this.playAnimation(this.images_walk);
                });
            } else if (this.alert) {
                console.log('Endboss is alert');
                this.playAnimation(this.images_alert);
            } else {
                console.log('Endboss is walking');
                this.playAnimation(this.images_walk);
            }
        }, 200);
    
        setInterval(() => {
            if (!this.isDead()) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
    }
    
}