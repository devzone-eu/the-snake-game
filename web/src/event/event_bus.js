import { assert } from "../helper/assert.js";

class EventBus {

    constructor() {
        this.callbacks = {};
    }

    /**
     * @param {string} event
     * @param {function} callback
     */
    subscribe(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }

        this.callbacks[event].push(callback);
    }

    /**
     * @param {string} event
     * @param {any} args
     */
    publish(event, ...args) {
        const eventCallbacksList = this.callbacks[event];

        assert(eventCallbacksList !== undefined, "Callbacks list for event should not be undefined", {"event": event, "list": eventCallbacksList});
        assert(eventCallbacksList.length > 0, "Callbacks list for event should not be empty", {"event": event});

        for (let callback of eventCallbacksList) {
            callback(...args);
        }
    }

}

export default new EventBus();
