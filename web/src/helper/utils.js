/**
 * @param {Number} value
 * @param {Number} repetitions
 * @returns {string}
 */
export function padZero(value, repetitions= 2) {
    return `${value}`.padStart(repetitions, "0");
}

/**
 * @param {Number} time
 * @returns {string}
 */
export function formatTime(time) {
    const hours = padZero(Math.floor(time / (60 * 60 * 1000)));
    const minutes = padZero(Math.floor((time % (60 * 60 * 1000)) / (60 * 1000)));
    const seconds = padZero(Math.floor((time % (60 * 1000)) / 1000));

    return `${hours}:${minutes}:${seconds}`;
}