export class Vector {
    
    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x = 0, y = 0) {
        /** @type {Number} */
        this.x = x;
        /** @type {Number} */
        this.y = y;
    }

    /**
     * @param {Number} maxWidth
     * @param {Number} maxHeight
     * @param {Number} blockSize
     * @returns {Vector}
     */
    static random(maxWidth, maxHeight, blockSize) {
        const randomX = Math.floor(Math.random() * (maxWidth / blockSize)) * blockSize;
        const randomY = Math.floor(Math.random() * (maxHeight / blockSize)) * blockSize;

        return new Vector(randomX, randomY);
    }

    /**
     * @param {Vector} vector
     * @returns {Vector}
     */
    copy(vector) {
        return new Vector(
            this.x + vector.getX(),
            this.y + vector.getY()
        );
    }

    /**
     * @returns {Number}
     */
    getX() {
        return this.x;
    }

    /**
     * @returns {Number}
     */
    getY() {
        return this.y;
    }

}