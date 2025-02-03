class Coins extends MoveableObject {
    y = 400;
    height = 80;
    width = 80;

    constructor() {
        super().loadImage('img/8_coin/coin_1.png');
        this.x = 200 + Math.random() * 2000;
        this.y = 400 + Math.random() * 100;
    }
}