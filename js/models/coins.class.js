class Coins extends MoveableObject{
    
    y = 20;
    height = 300;
    width = 500;

    constructor(){
        super().loadImage('img/8_coin/coin_1.png');
        this.x = 200 + Math.random() * 500;
        this.animate();
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
            this.x -= this.speed;
        }, 1000/60);
    }


}