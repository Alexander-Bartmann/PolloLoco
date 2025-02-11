/**
 * Class representing a background layer object
 * @extends MoveableObject
 */
class BackgroundObject extends MoveableObject {
    /** @type {number} - Width of the background layer */
    width = 720;
    /** @type {number} - Height of the background layer */
    height = 480;

    /**
     * Creates a new background object
     * @param {string} imagePath - Path to the background image
     * @param {number} x - X position of the background
     * @param {number} y - Y position of the background
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = x;
    }
}