import { assert } from "../helper/assert.js";
import Scene from "./scene.js";

/**
 * @param {HTMLCanvasElement} canvas 
 * @param {State} state 
 */
export default function startGame(canvas, state) {
    canvas.tabIndex = 0;
    canvas.focus();

    const activeScene = state.getActiveScene();

    assert(activeScene instanceof Scene, "Invalid type for active scene provided");

    activeScene.setCanvasWidth(state.options.sceneWidth);
    activeScene.setCanvasHeight(state.options.sceneHeight);
    activeScene.drawUserInterface(canvas, state);
}
