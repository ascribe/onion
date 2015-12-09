'use strict';

import { alt } from '../alt';


class EditionActions {
    constructor() {
        this.generateActions(
            'fetchEdition',
            'successFetchEdition',
            'successFetchCoa',
            'flushEdition',
            'errorCoa',
            'errorEdition'
        );
    }
}

export default alt.createActions(EditionActions);
