import Scene from "../scene.js";
import { DoubleCircularLinkedList } from "../../data_structure/linked_list.js";
import eventBus from "../../event/event_bus.js";

export default class Home extends Scene {

    /** @type {string | null} */
    _activeMenuItem = null

    /** @type {DoubleCircularLinkedList | null} */
    _linkedList = null

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    drawUserInterface(canvas, state) {
        const context = canvas.getContext("2d");

        this.setSceneTitle(context, "Main Menu", this.sceneWidth / 2, 50);
        this._setupListItems(state.scenes);
        this._drawUserMenu(state.scenes, context);
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {State} state
     */
    attachEventListeners(canvas, state) {
        const context = canvas.getContext("2d");

        window.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowUp":
                    this._activeMenuItem = this._linkedList.previous().getKey();
                    this.resetDrawingContext(context);
                    this.setSceneTitle(context, "Main Menu", this.sceneWidth / 2, 50);
                    this._drawUserMenu(state.scenes, context);

                    break;

                case "ArrowDown":
                    this._activeMenuItem = this._linkedList.next().getKey();
                    this.resetDrawingContext(context);
                    this.setSceneTitle(context, "Main Menu", this.sceneWidth / 2, 50);
                    this._drawUserMenu(state.scenes, context);

                    break;

                case "Enter":
                    // @TODO: The entire callback should probably be moved to a variable,
                    // since I have to figure out a way to remove the registered event
                    // once the scene is changed. Each scene should provide it's own event listeners
                    // and it's their responsibility to detach them once new scene is about to be rendered.
                    eventBus.publish("activeSceneChanged", this._linkedList.active(), state, canvas);

                    break;
            }
        });
    }

    /**
     * @param {Array<Scene>} scenes
     * @private
     */
    _setupListItems(scenes) {
        this._linkedList = new DoubleCircularLinkedList();

        scenes.forEach((scene) => {
            if (!scene.dedicated) {
                return;
            }

            this._linkedList.add(scene);
        });

        this._linkedList.start();
    }

    /**
     * @param {Array<Scene>} scenes
     * @param {CanvasRenderingContext2D} context
     * @private
     */
    _drawUserMenu(scenes,  context) {
        context.font = "2em Jungle Adventurer";
        context.textAlign = "center";
        context.fillStyle = "#afafaf";

        scenes.forEach((scene, k) => {
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

}
