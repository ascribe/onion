'use strict';

import { alt } from '../alt';

class ErrorQueueActions {
    constructor() {
        this.generateActions(
            'shiftErrorQueue'
        );
    }
}

export default alt.createActions(ErrorQueueActions);
