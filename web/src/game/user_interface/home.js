import Scene from "../scene.js";

export default class Home extends Scene {

    /**
     * @param {HTMLCanvasElement} canvas 
     */
    drawUserInterface(canvas) {
        const context = canvas.getContext("2d");

        this.resetDrawingContext(context);
        this.setSceneTitle(context, "Main Menu", this.sceneWidth / 2, 50);

        context.font = "30px Jungle Adventurer";
        context.textAlign = "center";
        context.fillStyle = "#afafaf";

        // TODO: Obtain menu items from configuration instead. 
        // Exclude the active screen scene.
        // Calculate index which we use to control where the text appear on "y".
        let index = 1;
        for (const item of ["New Game", "Multiplayer", "Settings"]) {
            // TODO: Alternate colors based on selection done via arrow keys.
            const fillColor = "#666";

            context.fillStyle = fillColor;
            context.fillText(item, this.sceneWidth / 2, 150 + (index++) * 50);
        }
    }

    /**
     * @param {HTMLCanvasElement} canvas 
     */
    attachEventListeners(canvas) {

    }

}
