'use strict';

import { alt } from '../alt';

import ErrorQueueActions from '../actions/error_queue_actions.js';

import { ErrorClasses } from '../constants/error_constants.js';

class ErrorQueueStore {
    constructor() {
        const { upload: { slowConnection, tryDifferentBrowser } } = ErrorClasses;

        this.errorQueues = {
            'upload': {
                queue: [slowConnection, tryDifferentBrowser],
                loop: true
            }
        };

        // Add intial index to each error queue
        Object
            .keys(this.errorQueues)
            .forEach((type) => {
                this.errorQueues[type].index = 0;
            });

        // Bind the exported functions to this instance
        this.getNextError = this.getNextError.bind(this);

        this.exportPublicMethods({
            getNextError: this.getNextError
        });
    }

    getNextError(type) {
        const errorQueue = this.errorQueues[type];
        const { queue, index } = errorQueue;

        ErrorQueueActions.shiftErrorQueue(type);
        return queue[index];
    }

    onShiftQueue(type) {
        const errorQueue = this.errorQueues[type];
        const { queue, loop } = errorQueue;

        ++errorQueue.index;
        if (loop) {
            // Loop back to the beginning if all errors have been exhausted
            errorQueue.index %= queue.length;
        }
    }
}

export default alt.createStore(ErrorQueueStore, 'ErrorQueueStore');
