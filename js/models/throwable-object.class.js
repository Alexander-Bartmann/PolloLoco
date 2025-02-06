class ThrowableObject extends MoveableObject {
    images_bottleThrow = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    images_bottleSplash = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    isSplashing = false;
    hasDamaged = false;
    throwInterval; 

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.images_bottleThrow);
        this.loadImages(this.images_bottleSplash);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw();
        this.animate();
    }

    throw() {
        this.speedY = 25;
        this.apllyGravity();
        this.throwInterval = setInterval(() => {
            if (!this.isSplashing) {
                this.x += 10;
            }
        }, 25);
    }

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

    splash() {
        this.isSplashing = true;
        this.speedY = 0;
        clearInterval(this.throwInterval);
    }

    apllyGravity() {
        setInterval(() => {
            if(!this.isSplashing && (this.isAboveGround() || this.speedY > 0)) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000/25);
    }
}