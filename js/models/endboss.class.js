class Endboss extends MoveableObject {

    height = 400;
    width = 300;
    y = 45;
    speed = 10;

    images_walk = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    images_alert = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    images_attack = [
        'img/4_enemie_boss_chicken/3_hurt/G13.png',
        'img/4_enemie_boss_chicken/3_hurt/G14.png',
        'img/4_enemie_boss_chicken/3_hurt/G15.png',
        'img/4_enemie_boss_chicken/3_hurt/G16.png',
        'img/4_enemie_boss_chicken/3_hurt/G17.png',
        'img/4_enemie_boss_chicken/3_hurt/G18.png',
        'img/4_enemie_boss_chicken/3_hurt/G19.png',
        'img/4_enemie_boss_chicken/3_hurt/G20.png',
    ];

    images_hurt = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];


    images_dead = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    constructor(){
        super();
        this.loadImages(this.images_walk);
        this.loadImages(this.images_alert);
        this.loadImages(this.images_dead);
        this.x = 2200;  
        this.speed = 0.2 + Math.random() * 0.2;
        this.animate();      
    }

    animate() {
        setInterval(() => {
            if (!this.isDead()) {
                this.x -= this.speed;
            }
        }, 1000 / 60);

        setInterval(() => {
            if(this.isDead()){
                this.playAnimation(this.images_dead);
            } else if (this.isHurt()){
                this.playAnimation(this.images_hurt);
            } else {
                this.playAnimation(this.images_walk);
            }            
        });
    }
}