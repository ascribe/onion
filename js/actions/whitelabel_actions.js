'use strict';

import { altWhitelabel } from '../alt';


class WhitelabelActions {
    constructor() {
        this.generateActions(
            'fetchWhitelabel',
            'successFetchWhitelabel',
            'whitelabelFailed'
        );
    }
}

export default altWhitelabel.createActions(WhitelabelActions);
