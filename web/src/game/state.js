import Home from "./user_interface/home.js";
import Multiplayer from "./user_interface/multiplayer.js";
import NewGame from "./user_interface/new_game.js";
import Settings from "./user_interface/settings.js";

/**
 * @param {Options} options
 * @returns {State}
 */
export function setupGameState(options) {
    /** @type {State} */
    return {
        options: options,
        scenes: [
            new Home("Home", "home_screen", false),
            new NewGame("New Game", "new_game", true),
            new Multiplayer("Multiplayer", "multiplayer", true),
            new Settings("Settings", "settings", true),
        ],
        activeScene: "home_screen",
        getActiveScene() {
            /** @type {Scene} */
            for (const scene of this.scenes) {
                if (scene.getKey() === this.activeScene) {
                    return scene;
                }
            }

            throw Error("Active scene `" + this.activeScene + "` was not found in registry.");
        },
    };
}