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
        let path = this.images[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines which image to display based on current percentage
     * @returns {number} Index of the image to display
     */    
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}