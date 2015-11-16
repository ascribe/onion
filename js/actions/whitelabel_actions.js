'use strict';

import { altWhitelabel } from '../alt';


class WhitelabelActions {
    constructor() {
        this.generateActions(
            'fetchWhitelabel',
            'successFetchWhitelabel',
            'errorWhitelabel'
        );
    }
}

export default altWhitelabel.createActions(WhitelabelActions);
