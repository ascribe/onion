'use strict';

import requests from '../utils/requests';

import EditionActions from '../actions/edition_actions';


const CoaSource = {
    lookupCoa: {
        remote(state, coaId) {
            return requests
                .get('coa', { id: coaId })
                .then((res) => {
                    // If no coa is found here, fake a 404 error so the error action can pick it up
                    return (res && res.coa) ? res : Promise.reject({ json: { status: 404 } });
                });
        },

        success: EditionActions.successFetchCoa,
        error: EditionActions.errorCoa
    },

    performCreateCoaForEdition: {
        remote(state, editionId) {
            return requests.post('coa_create', { body: { bitcoin_id: editionId } });
        },

        success: EditionActions.successFetchCoa,
        error: EditionActions.errorCoa
    }
};

export default CoaSource;
