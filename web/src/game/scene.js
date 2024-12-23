import { assert } from "../helper/assert.js";

export default class Scene {

    sceneWidth = 640
    sceneHeight = 480
    
    /**
     * @param {string} title
     * @param {string} key 
     * @param {boolean} dedicated
     */
    constructor(title, key, dedicated) {
        this.title = title;
        this.key = key;
        this.dedicated = dedicated;
    }

    /**
     * @returns {string}
     */
    getTitle() {
        return this.title;
    }

    /**
     * @returns {string}
     */
    getKey() {
        return this.key;
    }

    /**
     * @param {number} width 
     */
    setCanvasWidth(width) {
        assert(typeof width === "number", "Invalid type for width provided", {"width": width});

        this.sceneWidth = width;
    }

    /**
     * @param {number} height 
     */
    setCanvasHeight(height) {
        assert(typeof height === "number", "Invalid type for height provided", {"height": height});

        this.sceneHeight = height;
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    drawUserInterface(canvas, state) {
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    attachEventListeners(canvas, state) {
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {number} x
     * @param {number} y
     */
    resetDrawingContext(context, x = 0, y = 0) {
        context.clearRect(x, y, this.sceneWidth, this.sceneHeight);
        context.imageSmoothingEnabled = false;
    }

    /**
     * @param {CanvasRenderingContext2D} context 
     * @param {string} title 
     * @param {number} x 
     * @param {number} y 
     */
    setSceneTitle(context, title, x, y) {
        assert(typeof x === "number", "Invalid type for x provided", {"x": x});
        assert(typeof y === "number", "Invalid type for y provided", {"y": y});
        assert(this.sceneWidth >= x || x < 0, "Provided value for x is out of bounds", {"x": x});
        assert(this.sceneHeight >= y || x < 0, "Provided value for y is out of bounds", {"y": y});

        context.font = "3em Jungle Adventurer";
        context.textAlign = "center";
        context.fillStyle = "#666";
        context.fillText(title, x, y);
    }

}
