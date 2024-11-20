import { assert } from "./assert.js";

export default class Direction {

    /**
     * @param { any } x
     * @param { any } y
     * @param { string } direction
     */
    constructor(x, y, direction) {
        const allowedDirections = ["left", "right", "up", "down"];

        assert(typeof x === "number", "Invalid value specified", {"x": x});
        assert(typeof y === "number", "Invalid value specified", {"y": y});
        assert(allowedDirections.includes(direction), "Invalid direction specified", {"direction": direction});

        this.x = x;
        this.y = y;
        this.direction = direction;
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

    /**
     * @returns {string}
     */
    getDirection() {
        return this.direction;
    }

}