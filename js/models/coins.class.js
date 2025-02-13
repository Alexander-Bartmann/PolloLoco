/**
 * Class representing a collectible coin in the game
 * @extends MoveableObject
 */
class Coins extends MoveableObject {
    /** @type {number} - Vertical position of the coin */
    y = 300;
    /** @type {number} - Height of the coin sprite */
    height = 80;
    /** @type {number} - Width of the coin sprite */
    width = 80;

    offset = {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40
    };

    /**
     * Creates a new coin with random position
     */
    constructor() {
        super().loadImage('img/8_coin/coin_1.png');
        this.x = 200 + Math.random() * 2000;
        this.y = 350 + Math.random() * 10; // Vertikale Position auf Höhe der Hühner gesetzt
    }
}