class StaticBottle extends DrawableObject {
    constructor() {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = 200 + Math.random() * 2000;
        this.y = 365;
        this.height = 60;
        this.width = 60;
    }
}
