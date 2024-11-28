import Scene from "../scene.js";
import {assert} from "../../helper/assert.js";
import {Vector} from "../math.js";
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

    /** @type {HTMLImageElement | null} */
    _appleImage = null

    /** @type {Number | null} */
    _tickId = null

    /** @type {Set} */
    _snakeCoordinates

    /** @type {boolean} */
    _gameOver = false

    /** @type {Number} */
    _score = 0

    /** @type {Number | null} */
    _startAt = null

    /**
     * @param {string} title
     * @param {string} key
     * @param {boolean} dedicated
     */
    constructor(title, key, dedicated) {
        super(title, key, dedicated);

        this._appleImage = new Image();
        this._appleImage.src = "/assets/images/apple.png";

        this._snakeCoordinates = new Set();
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    drawUserInterface(canvas, state) {
        assert(state.currentDirection.getDirection() === "none", "Current direction should be `none` when the game is started for the first time");
        assert(state.snakePosition.length > 0, "The initial position of the snake should be configured before the game is started");

        const context = canvas.getContext("2d");
        this._drawMetadata(state);
        this._drawSnake(context, state);
        this._drawApple(context, state);
        this._drawDebugGrid(context, state);
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    attachEventListeners(canvas, state) {
        eventBus.subscribe("positionChanged", /**
             @param {CanvasRenderingContext2D} context
             @param {State} state
             */
            (context, state) => {
                if (this._appleCoordinates === null && !this._gameOver) {
                    ++this._score;

                    document.getElementById('score').textContent = this._score.toString();
                }

                if (this._tickId !== null && this._startAt === null) {
                    this._startAt = performance.now();

                    const padZero = (/** @type {Number} */ value, /** @type {Number} */ repetitions = 2) => `${value}`.padStart(repetitions, "0");
                    const formatTime = function(/** @type {Number} */time) {
                        const hours = padZero(Math.floor(time / (60 * 60000)));
                        const minutes = padZero(Math.floor(time / 60000));
                        const seconds = padZero(Math.floor(time / 1000));

                        return `${hours}:${minutes}:${seconds}`;
                    };

                    const calculateTime = (function() {
                        if (this._gameOver) {
                            return;
                        }

                        document.getElementById('time').textContent = formatTime(performance.now() - this._startAt);

                        setTimeout(calculateTime, 1000);
                    }).bind(this);

                    calculateTime();
                }

                this._storeSnakeCoordinates(state);
                this._drawSnake(context, state);
                this._drawApple(context, state);
                this._drawDebugGrid(context, state);
            }
        );

        eventBus.subscribe("gameOver", /**
            @param {CanvasRenderingContext2D} context
            @param {State} state
            */
            (context, state) => {
                this._gameOver = true;
                state.options.debug = false;

                state.currentDirection = new Direction(0, 0, "none");

                const startX = (15 * state.options.sceneWidth) / 100;
                const startY = (15 * state.options.sceneHeight) / 100;

                context.clearRect(0, 0, state.options.sceneWidth, state.options.sceneHeight);
                context.fillStyle = 'rgba(225, 225, 225, 0.5)';
                context.fillRect(startX, startY, state.options.sceneWidth - startX * 2, state.options.sceneHeight - startY * 2);

                context.font = "3.5em Jungle Adventurer";
                context.textAlign = "center";
                context.fillStyle = "#333";
                context.fillText("Game Over", state.options.sceneWidth / 2, state.options.sceneHeight / 3);

                window.clearInterval(this._tickId);
                window.removeEventListener("keydown", this._keydownListener);
            }
        );

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
     * @param {State} state
     * @private
     */
    _drawMetadata(state) {
        const metadata = document.createElement('div');

        metadata.classList.add('game-metadata');
        metadata.innerHTML = 'Apples Eaten: <span id="score">0</span> / Time Elapsed <span id="time">00:00:00</span>';

        document.body.prepend(metadata);
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {State} state
     * @private
     */
    _tick(context, state) {
        if (state.currentDirection.getDirection() === "none" || this._gameOver) {
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
     * @param {State} state
     * @private
     */
    _drawApple(context, state) {
        if (this._appleCoordinates === null) {
            let overlapping;
            let randomCoordinates;

            do {
                randomCoordinates = Vector.random(state.options.sceneWidth, state.options.sceneHeight, state.options.blockSize);
                overlapping = state.snakePosition.filter(vector => vector.getX() === randomCoordinates.getX() && vector.getY() === randomCoordinates.getY());
            } while (overlapping.length > 0);

            this._appleCoordinates = randomCoordinates;
        }

        context.drawImage(
            this._appleImage,
            this._appleCoordinates.getX(),
            this._appleCoordinates.getY()
        );
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
         *  - Add an option to increase difficulty
         *      - Movement (speed) could be increased via settings.
         *      - Allow boundaries to be crossed on easy, and enable wall collision on hard.
         */

        assert(!this._gameOver, "The game is over, start a new one");

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

        let headNextPositionKey = `${position.getX()}_${position.getY()}`;

        if (this._snakeCoordinates.has(headNextPositionKey)) {
            eventBus.publish("gameOver", context, state);

            return;
        }

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
     * @param {State} state
     * @private
     */
    _storeSnakeCoordinates(state) {
        this._snakeCoordinates.clear();

        for (let [index, position] of state.snakePosition.entries()) {
            if (index === 0) {
                continue;
            }

            let key = `${position.getX()}_${position.getY()}`;

            this._snakeCoordinates.add(key);
        }
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