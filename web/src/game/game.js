import { assert } from "../helper/assert.js";
import Scene from "./scene.js";
import eventBus from "../event/event_bus.js";

eventBus.subscribe("activeSceneChanged", /**
 * @param {Scene} activeScene
 * @param {State} state
 * @param {HTMLCanvasElement} canvas
 */
(activeScene, state, canvas) => {
    assert(activeScene instanceof Scene, "Incorrect type for active scene specified", typeof activeScene);
    assert(state instanceof Object, "Incorrect type for state specified", typeof state);
    assert(canvas instanceof HTMLCanvasElement, "Incorrect type for canvas specified", typeof canvas);

    activeScene.setCanvasWidth(state.options.sceneWidth);
    activeScene.setCanvasHeight(state.options.sceneHeight);
    activeScene.resetDrawingContext(canvas.getContext("2d"));
    activeScene.drawUserInterface(canvas, state);
    activeScene.attachEventListeners(canvas, state);
});

/**
 * @param {HTMLCanvasElement} canvas 
 * @param {State} state 
 */
export default function startGame(canvas, state) {
    canvas.tabIndex = 0;
    canvas.focus();

    const activeScene = state.getActiveScene();

    assert(activeScene instanceof Scene, "Invalid type for active scene provided");

    eventBus.publish("activeSceneChanged", activeScene, state, canvas);

    activeScene.setCanvasWidth(state.options.sceneWidth);
    activeScene.setCanvasHeight(state.options.sceneHeight);
    activeScene.drawUserInterface(canvas, state);
}
