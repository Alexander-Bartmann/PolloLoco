/**
 * Represents a static bottle object that can be collected in the game
 * @extends DrawableObject
 */
class StaticBottle extends DrawableObject {

    offset = {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40
    };

    /**
     * Creates a new static bottle with random x-position on the ground
     */
    constructor() {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = 200 + Math.random() * 2000;
        this.y = 365;
        this.height = 60;
        this.width = 60;
    }
}
