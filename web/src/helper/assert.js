/**
 * @param {boolean} expression
 * @param {string} message
 * @param {any} args
 */
export function assert(expression, message, ...args) {
    if (!expression) {
        console.error(message, args);

        throw new Error(message);
    }
}