/**
 * Class representing the coin status bar for collected coins
 * @extends DrawableObject
 */
class CoinBar extends DrawableObject {
    /** @type {string[]} - Array of image paths for different coin states */
    images = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ];

    /** @type {number} - Current percentage value of collected coins */
    percentage = 0;

    /**
     * Creates a new CoinBar instance and initializes it
     */
    constructor() {
        super();
        this.loadImages(this.images);
        this.x = 30;
        this.y = 35;
        this.width = 200;
        this.height = 40;
        this.setPercentage(0);
    }

    /**
     * Updates the coin bar's percentage and corresponding image
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
        if (this.percentage >= 100) {
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