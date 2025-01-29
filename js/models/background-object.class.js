class BackgroundObject extends MoveableObject{

    width = 720;
    height = 480;
    constructor(imagePath, x, y){
        super().loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = x;
    }
}