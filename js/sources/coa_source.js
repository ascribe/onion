'use strict';

import requests from '../utils/requests';

import EditionActions from '../actions/edition_actions';


const CoaSource = {
    lookupCoa: {
        remote(state) {
            return requests.get('coa', { id: state.edition.coa });
        },

        success: EditionActions.successFetchCoa,
        error: EditionActions.errorCoa
    },

    performCreateCoa: {
        remote(state) {
            return requests.post('coa_create', {body: { bitcoin_id: state.edition.bitcoin_id }});
        },
        success: EditionActions.successFetchCoa,
        error: EditionActions.errorCoa
    }
};

export default CoaSource;