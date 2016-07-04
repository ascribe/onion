'use strict';

import request from '../utils/request';

import EditionActions from '../actions/edition_actions';


const EditionSource = {
    lookupEdition: {
        remote(state, bitcoinId) {
            return request('edition', {
                urlTemplateSpec: { bitcoinId }
            });
        },

        success: EditionActions.successFetchEdition,
        error: EditionActions.errorEdition
    }
};

export default EditionSource;
