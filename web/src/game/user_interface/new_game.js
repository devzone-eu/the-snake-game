import Scene from "../scene.js";
import { assert } from "../../helper/assert.js";
import { Vector } from "../math.js";
import eventBus from "../../event/event_bus.js";
import Direction from "../../helper/direction.js";

export default class NewGame extends Scene {

    /** @type {function(KeyboardEvent): void} */
    _keydownListener = null

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    drawUserInterface(canvas, state) {
        assert(state.currentDirection === "none", "Current direction should be `none` when the game is started for the first time");
        assert(state.snakePosition.length > 0, "The initial position of the snake should be configured before the game is started");

        const context = canvas.getContext("2d");
        this._drawSnake(context, state);

        eventBus.subscribe("positionChanged", /**
            @param {CanvasRenderingContext2D} context
            @param {State} state
            */
            (context, state) => {
                this._drawSnake(context, state);
            }
        );
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    attachEventListeners(canvas, state) {
        const directionsMapping = {
            "ArrowUp":      new Direction(0, -state.options.blockSize, "up"),
            "ArrowDown":    new Direction(0, state.options.blockSize, "down"),
            "ArrowLeft":    new Direction(-state.options.blockSize, 0, "left"),
            "ArrowRight":   new Direction(state.options.blockSize, 0, "right"),
        };

        const context = canvas.getContext("2d");

        this._keydownListener = (e) => {
            if (directionsMapping.hasOwnProperty(e.key)) {
                /** @type Direction */
                let direction = directionsMapping[e.key];

                this._move(direction, context, state);
            }
        };

        window.addEventListener("keydown", this._keydownListener);
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {State} state
     * @private
     */
    _drawSnake(context, state) {
        this.resetDrawingContext(context, 0, 0);

        for (let [index, vector] of state.snakePosition.entries()) {
            context.beginPath();
            context.fillStyle = index === 0 ? "#777" : "#555";
            context.rect(vector.getX(), vector.getY(), state.options.blockSize, state.options.blockSize);
            context.fill();
            context.closePath();
        }
    }

    /**
     * @param {Direction} direction
     * @param {CanvasRenderingContext2D} context
     * @param {State} state
     * @private
     */
    _move(direction, context, state) {
        let head = state.snakePosition[0];

        assert(head instanceof Vector, "Invalid type provided for snake head position", {"head": head});

        if (state.currentDirection === "left" && direction.getDirection() === "right") {
            return;
        }

        if (state.currentDirection === "right" && direction.getDirection() === "left") {
            return;
        }

        let position = this._calculateCoordinatesForBoundaries(
            head,
            direction,
            state.options.sceneWidth,
            state.options.sceneHeight,
            state.options.blockSize
        );

        state.snakePosition.unshift(position);
        state.snakePosition.pop();
        state.currentDirection = direction.getDirection();

        eventBus.publish("positionChanged", context, state);
    }

    /**
     * @param {Vector} head
     * @param {Direction} direction
     * @param {Number} sceneWidth
     * @param {Number} sceneHeight
     * @param {Number} blockSize
     * @returns {Vector}
     * @private
     */
    _calculateCoordinatesForBoundaries(head, direction, sceneWidth, sceneHeight, blockSize) {
        let nextX = head.getX() + direction.getX();
        let nextY = head.getY() + direction.getY();

        if (nextX < 0) {
            nextX = sceneWidth - blockSize;
        } else if (nextX >= sceneWidth) {
            nextX = 0;
        }

        if (nextY < 0) {
            nextY = sceneHeight - blockSize;
        } else if (nextY >= sceneHeight) {
            nextY = 0;
        }

        return new Vector(nextX, nextY);
    }

}