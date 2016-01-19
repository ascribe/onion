'use strict';

import { alt } from '../alt';


class EditionActions {
    constructor() {
        this.generateActions(
            'fetchEdition',
            'successFetchCoa',
            'successFetchEdition',
            'errorCoa',
            'errorEdition',
            'flushEdition'
        );
    }
}

export default alt.createActions(EditionActions);
