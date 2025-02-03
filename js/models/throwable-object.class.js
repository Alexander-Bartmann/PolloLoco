class ThrowableObject extends MoveableObject {

    constructor(x,y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.throw();
        this.height = 60;
        this.width = 50;
    }

    throw(){
        this.speedY = 25;
        this.apllyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);
    }
    
}