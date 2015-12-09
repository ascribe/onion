'use strict';

import requests from '../utils/requests';

import EditionActions from '../actions/edition_actions';


const EditionSource = {
    lookupEdition: {
        remote(state) {
            return requests.get('edition', { bitcoin_id: state.editionMeta.idToFetch });
        },

        success: EditionActions.successFetchEdition,
        error: EditionActions.errorEdition
    }
};

export default EditionSource;