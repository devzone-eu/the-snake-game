import Scene from "../scene.js";
import { assert } from "../../helper/assert.js";
import { Vector } from "../math.js";
import eventBus from "../../event/event_bus.js";
import Direction from "../../helper/direction.js";

const DIRECTION_UP = "up";
const DIRECTION_DOWN = "down";
const DIRECTION_LEFT = "left";
const DIRECTION_RIGHT = "right";

const OPPOSITE_DIRECTIONS = {
    [DIRECTION_UP]: DIRECTION_DOWN,
    [DIRECTION_DOWN]: DIRECTION_UP,
    [DIRECTION_LEFT]: DIRECTION_RIGHT,
    [DIRECTION_RIGHT]: DIRECTION_LEFT,
};

export default class NewGame extends Scene {

    /** @type {function(KeyboardEvent): void} */
    _keydownListener = null

    /** @type {Vector | null} */
    _appleCoordinates = null

    /** @type {Number | null} */
    _tickId = null

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    drawUserInterface(canvas, state) {
        assert(state.currentDirection.getDirection() === "none", "Current direction should be `none` when the game is started for the first time");
        assert(state.snakePosition.length > 0, "The initial position of the snake should be configured before the game is started");

        const context = canvas.getContext("2d");
        this._drawSnake(context, state);
        this._drawApple(context, state.options);
        this._drawDebugGrid(context, state);

        eventBus.subscribe("positionChanged", /**
            @param {CanvasRenderingContext2D} context
            @param {State} state
            */
            (context, state) => {
                this._drawSnake(context, state);
                this._drawApple(context, state.options);
                this._drawDebugGrid(context, state);
            }
        );
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    attachEventListeners(canvas, state) {
        const directionsMapping = {
            "ArrowUp":      new Direction(0, -state.options.blockSize, DIRECTION_UP),
            "ArrowDown":    new Direction(0, state.options.blockSize, DIRECTION_DOWN),
            "ArrowLeft":    new Direction(-state.options.blockSize, 0, DIRECTION_LEFT),
            "ArrowRight":   new Direction(state.options.blockSize, 0, DIRECTION_RIGHT),
        };

        const context = canvas.getContext("2d");

        this._keydownListener = (e) => {
            if (directionsMapping.hasOwnProperty(e.key)) {
                /** @type Direction */
                let direction = directionsMapping[e.key];

                if (state.currentDirection.getDirection() === OPPOSITE_DIRECTIONS[direction.getDirection()]) {
                    return;
                }

                state.currentDirection = direction;

                const lastDirectionInQueue = state.inputQueue[state.inputQueue.length - 1] || direction;

                if (lastDirectionInQueue.getDirection() !== OPPOSITE_DIRECTIONS[direction.getDirection()]) {
                    state.inputQueue.push(direction);
                }
            }
        };

        window.addEventListener("keydown", this._keydownListener);

        this._tickId = window.setInterval(() => this._tick(context, state), state.options.refreshInterval);
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {State} state
     * @private
     */
    _tick(context, state) {
        if (state.currentDirection.getDirection() === "none") {
            return;
        }

        if (state.inputQueue.length > 0) {
            const nextDirection = state.inputQueue.shift();

            if (nextDirection.getDirection() !== OPPOSITE_DIRECTIONS[state.currentDirection.getDirection()]) {
                state.currentDirection = nextDirection;
            }
        }

        this._move(state.currentDirection, context, state);
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
            context.fillStyle = index === 0 ? state.options.colors.snakeHead : state.options.colors.snakeBody;
            context.rect(vector.getX(), vector.getY(), state.options.blockSize, state.options.blockSize);
            context.fill();
            context.closePath();
        }
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {Options} options
     * @private
     */
    _drawApple(context, options) {
        if (this._appleCoordinates === null) {
            const randomX = Math.floor(Math.random() * (options.sceneWidth / options.blockSize)) * options.blockSize;
            const randomY = Math.floor(Math.random() * (options.sceneHeight / options.blockSize)) * options.blockSize;

            this._appleCoordinates = new Vector(randomX, randomY);
        }

        context.beginPath();
        context.fillStyle = options.colors.apple;
        context.rect(this._appleCoordinates.getX(), this._appleCoordinates.getY(), options.blockSize, options.blockSize);
        context.fill();
        context.closePath();
    }

    /**
     * @param {Direction} direction
     * @param {CanvasRenderingContext2D} context
     * @param {State} state
     * @private
     */
    _move(direction, context, state) {
        /**
         * @TODO:
         *  - Collision detection - currently the snake can go through itself, fantastic.
         *  - Add an option to increase difficulty
         *      - Movement (speed) could be increased via settings.
         *      - Allow boundaries to be crossed on easy, and enable wall collision on hard.
         *  - Apple random coordinates calculations should be improved, because the apple can be spawn right on top of the snake, incredible.
         */

        let head = state.snakePosition[0];

        assert(head instanceof Vector, "Invalid type provided for snake head position", {"head": head});

        state.currentDirection = direction;

        let position = this._calculateCoordinatesForBoundaries(
            head,
            direction,
            state.options.sceneWidth,
            state.options.sceneHeight,
            state.options.blockSize
        );

        state.snakePosition.unshift(position);

        if (position.getX() === this._appleCoordinates.getX() && position.getY() === this._appleCoordinates.getY()) {
            this._appleCoordinates = null;
        } else {
            state.snakePosition.pop();
        }

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

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {State} state
     * @private
     */
    _drawDebugGrid(context, state) {
        if (state.options.debug === false)  {
            return;
        }

        context.save();
        context.strokeStyle = "#afafaf";
        context.lineWidth = 0.5;

        for (let x = 0; x <= state.options.sceneWidth; x += state.options.blockSize) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, state.options.sceneHeight);
            context.stroke();
        }

        for (let y = 0; y <= state.options.sceneHeight; y += state.options.blockSize) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(state.options.sceneWidth, y);
            context.stroke();
        }

        context.restore();
    }

}