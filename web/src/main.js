import startGame from "./game/game.js";
import { setupGameState } from "./game/state.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game");

/** @type {Options} */
const options = {
    sceneWidth: canvas.width,
    sceneHeight: canvas.height,
    blockSize: 24,
};

/** @type {State} */
const state = setupGameState(options);

startGame(canvas, state);
