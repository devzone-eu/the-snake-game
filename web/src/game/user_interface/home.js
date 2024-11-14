import Scene from "../scene.js";

export default class Home extends Scene {

    /** @type {string | null} */
    _activeMenuItem = null

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    drawUserInterface(canvas, state) {
        const context = canvas.getContext("2d");

        this.resetDrawingContext(context);
        this.setSceneTitle(context, "Main Menu", this.sceneWidth / 2, 50);

        context.font = "30px Jungle Adventurer";
        context.textAlign = "center";
        context.fillStyle = "#afafaf";

        state.scenes.forEach((scene, k) => {
            if (!scene.dedicated) {
                return;
            }

            if (this._activeMenuItem === null) {
                this._activeMenuItem = scene.getKey();
            }

            context.fillStyle = scene.getKey() === this._activeMenuItem ? "#FFF" : "#666";
            context.fillText(scene.getTitle(), this.sceneWidth / 2, 150 + k * 50);
        });
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    attachEventListeners(canvas, state) {

    }

}
