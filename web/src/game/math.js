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