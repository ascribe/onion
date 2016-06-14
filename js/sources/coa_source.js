'use strict';

import request from '../utils/request';

import EditionActions from '../actions/edition_actions';


const CoaSource = {
    lookupCoa: {
        remote(state, coaId) {
            return request('coa', {
                urlTemplateSpec: {
                    id: coaId
                }
            }).then((res) => (
                // If no coa is found here, fake a 404 error so the error action can pick it up
                (res && res.coa) ? res : Promise.reject({ json: { status: 404 } })
            ));
        },

        success: EditionActions.successFetchCoa,
        error: EditionActions.errorCoa
    },

    performCreateCoaForEdition: {
        remote(state, editionId) {
            return request('coa_create', {
                method: 'POST',
                jsonBody: { bitcoin_id: editionId }
            });
        },

        success: EditionActions.successFetchCoa,
        error: EditionActions.errorCoa
    }
};

export default CoaSource;
