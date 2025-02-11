/**
 * Class representing the status bar for the end boss health
 * @extends DrawableObject
 */
class EndbossStatusBar extends DrawableObject {
    /** @type {string[]} - Array of image paths for different health states of endboss */
    images = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    /** @type {number} - Current percentage value of the status bar */
    percentage = 100;

    /**
     * Creates a new EndbossStatusBar instance and initializes it
     */
    constructor() {
        super();
        this.loadImages(this.images);
        this.x = 500;
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