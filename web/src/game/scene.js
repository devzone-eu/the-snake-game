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
    setSceneWidth(width) {
        this.sceneWidth = width;
    }

    /**
     * @param {number} height 
     */
    setSceneHeight(height) {
        this.sceneHeight = height;
    }

    /**
     * @param {CanvasRenderingContext2D} context
     */
    resetDrawingContext(context) {
        context.clearRect(0, 0, this.sceneWidth, this.sceneHeight);
        context.imageSmoothingEnabled = false;
    }

    /**
     * @param {CanvasRenderingContext2D} context 
     * @param {string} title 
     * @param {number} x 
     * @param {number} y 
     */
    setSceneTitle(context, title, x, y) {
        context.font = "42px Jungle Adventurer";
        context.textAlign = "center";
        context.fillStyle = "#afafaf";
        context.fillText(title, x, y);
    }

}