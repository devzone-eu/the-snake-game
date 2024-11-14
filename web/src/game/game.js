/**
 * @param {HTMLCanvasElement} canvas 
 * @param {State} state 
 */
export default function startGame(canvas, state) {
    canvas.tabIndex = 0;
    canvas.focus();

    const activeScene = state.getActiveScene();

    activeScene.setSceneWidth(state.options.sceneWidth);
    activeScene.setSceneHeight(state.options.sceneHeight);
    activeScene.drawUserInterface(canvas);
}
