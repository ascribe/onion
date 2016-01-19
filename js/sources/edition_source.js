'use strict';

import requests from '../utils/requests';

import EditionActions from '../actions/edition_actions';


const EditionSource = {
    lookupEdition: {
        remote(state, editionId) {
            return requests.get('edition', { bitcoin_id: editionId });
        },

        success: EditionActions.successFetchEdition,
        error: EditionActions.errorEdition
    }
};

export default EditionSource;
