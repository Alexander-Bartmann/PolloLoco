/**
 * Class representing a moving cloud in the background
 * @extends MoveableObject
 */
class Cloud extends MoveableObject {
    /** @type {number} - Vertical position of the cloud */
    y = 20;
    /** @type {number} - Height of the cloud sprite */
    height = 300;
    /** @type {number} - Width of the cloud sprite */
    width = 500;

    /**
     * Creates a new cloud with random horizontal position
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = 200 + Math.random() * 500;
        this.animate();
    }

    /**
     * Starts the cloud's movement animation
     */
    animate() {
        this.moveLeft();
        setInterval(() => {
            this.x -= this.speed;
        }, 1000/60);
    }
}