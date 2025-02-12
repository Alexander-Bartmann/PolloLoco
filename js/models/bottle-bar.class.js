/**
 * Class representing the bottle collection status bar
 * @extends DrawableObject
 */
class BottleBar extends DrawableObject {
    /** @type {string[]} - Array of image paths for different bottle states */
    images = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    /** @type {number} - Current percentage value of collected bottles */
    percentage = 0;

    /**
     * Creates a new BottleBar instance and initializes it
     */
    constructor() {
        super();
        this.loadImages(this.images);
        this.x = 30;
        this.y = 70;
        this.width = 200;
        this.height = 40;
        this.setPercentage(0);
    }

    /**
     * Updates the bottle bar's percentage based on collected bottles
     * @param {number} bottles - Number of collected bottles
     */
    setPercentage(bottles) {
        this.percentage = bottles;
        let path = this.images[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines which image to display based on current percentage
     * @returns {number} Index of the image to display
     */
    resolveImageIndex() {
        if (this.percentage >= 10) {
            return 5;
        } else if (this.percentage >= 8) {
            return 4;
        } else if (this.percentage >= 6) {
            return 3;
        } else if (this.percentage >= 4) {
            return 2;
        } else if (this.percentage >= 1) {
            return 1;
        } else {
            return 0;
        }
    }
}