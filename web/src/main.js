import startGame from "./game/game.js";
import { setupGameState } from "./game/state.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game");

/** @type {Options} */
const options = {
    sceneWidth: canvas.width,
    sceneHeight: canvas.height,
    blockSize: 20,
    snakeInitialSize: 4,
    colors: {
        apple: "#c31c1c",
        snakeHead: "#227518",
        snakeBody: "#185508",
    },
};

/** @type {State} */
const state = setupGameState(options);

startGame(canvas, state);
