class Bottles extends MoveableObject {
    y = 300;
    height = 60;
    width = 60;

    constructor() {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = 200 + Math.random() * 2000;
        this.y = 50 + Math.random() * 100;
    }
}
