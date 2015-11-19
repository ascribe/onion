'use strict'

var startTime = null;

export function startTimer() {
    startTime = new Date();
};

export function endTimer() {
    if (startTime) {
        const time = new Date() - startTime;
        startTime = null;
        return time;
    }
}
