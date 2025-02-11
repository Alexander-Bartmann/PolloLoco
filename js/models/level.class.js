/**
 * Represents a game level containing enemies, clouds, and background objects
 * @class
 */
class Level {
    /** @type {Array<Enemy>} - Array of enemy objects in the level */
    enemies;
    /** @type {Array<Cloud>} - Array of cloud objects for parallax effect */
    clouds;
    /** @type {Array<BackgroundObject>} - Array of background layer objects */
    backgroundObjects;
    /** @type {number} - X-coordinate where the level ends */
    level_end_x = 2200;

    /**
     * Creates a new Level instance
     * @param {Array<Enemy>} enemies - Array of enemies to place in the level
     * @param {Array<Cloud>} clouds - Array of clouds for background effect
     * @param {Array<BackgroundObject>} backgroundObjects - Array of background layers
     */
    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}