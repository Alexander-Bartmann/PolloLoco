/**
 * Base class for all drawable game objects
 * @class
 */
class DrawableObject {
    /** @type {HTMLImageElement} - The image element for the object */
    img;
    /** @type {Object.<string, HTMLImageElement>} - Cache for loaded images */
    imageCache = {};
    /** @type {number} - Current image index for animations */
    currentImage = 0;
    /** @type {number} - X position on canvas */
    x = 120;
    /** @type {number} - Y position on canvas */
    y = 290;
    /** @type {number} - Height of the object */
    height = 150;
    /** @type {number} - Width of the object */
    width = 100;
    
    /**
     * Loads an image from the given path
     * @param {string} path - Path to the image file
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the canvas if image is loaded
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (this.img && this.img.complete) { 
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Loads multiple images and stores them in the image cache
     * @param {string[]} arr - Array of image paths to load
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });

    }

    /**
     * Determines which image to display based on current percentage
     * Common implementation for status bars
     * @param {number} percentage - Current percentage value
     * @returns {number} Index of the image to display
     */
    resolveImageIndex(percentage = this.percentage) {
        if (percentage == 100) {
            return 5;
        } else if (percentage >= 80) {
            return 4;
        } else if (percentage >= 60) {
            return 3;
        } else if (percentage >= 40) {
            return 2;
        } else if (percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}