/**
 * Class representing a status bar for health display
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    /** @type {string[]} - Array of image paths for different health states */
    images = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];

    /** @type {number} - Current percentage value of the status bar */
    percentage = 100;

    /**
     * Creates a new StatusBar instance and initializes it
     */
    constructor() {
        super();
        this.loadImages(this.images);
        this.x = 30;
        this.y = 0;
        this.width = 200;
        this.height = 40;
        this.setPercentage(100);
    }

    /**
     * Updates the status bar's percentage and corresponding image
     * @param {number} percentage - New percentage value between 0 and 100
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.images[this.resolveImageIndex(this.percentage)];
        this.img = this.imageCache[path];
    }
}