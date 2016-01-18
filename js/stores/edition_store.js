'use strict';

import { alt } from '../alt';

import EditionActions from '../actions/edition_actions';

import EditionSource from '../sources/edition_source';
import CoaSource from '../sources/coa_source';

import { mergeOptions } from '../utils/general_utils';


class EditionStore {
    constructor() {
        this.edition = {};
        this.editionMeta = {
            err: null
        };
        this.coaMeta = {
            err: null
        };

        this.bindActions(EditionActions);
        this.registerAsync(mergeOptions(EditionSource, CoaSource));
    }

    onFetchEdition(editionId) {
        this.getInstance().lookupEdition(editionId);

        // Prevent alt from sending an empty change event when a request is sent
        // off to the source
        this.preventDefault();
    }

    onSuccessFetchEdition({ edition }) {
        if (edition) {
            this.edition = edition;
            this.editionMeta.err = null;

            // Also fetch coa if allowed
            if (edition.acl.acl_coa) {
                if (edition.coa && typeof edition.coa.constructor !== Object) {
                    this.getInstance().lookupCoa(edition.coa);
                } else if (!edition.coa) {
                    this.getInstance().performCreateCoaForEdition(edition.bitcoin_id);
                }
            }
        } else {
            this.editionMeta.err = new Error('Problem fetching the edition');
            console.logGlobal(this.editionMeta.err);
        }
    }

    onSuccessFetchCoa({ coa }) {
        if (coa && Object.keys(this.edition).length) {
            this.edition.coa = coa;
            this.coaMeta.err = null;
        } else {
            this.coaMeta.err = new Error('Problem generating/fetching the COA');
            console.logGlobal(this.coaMeta.err);
        }
    }

    onFlushEdition() {
        this.edition = {};
        this.editionMeta = {
            err: null,
            idToFetch: null
        };
        this.coaMeta = {
            err: null
        };
    }

    onErrorEdition(err) {
        console.logGlobal(err);
        this.editionMeta.err = err;
    }

    onErrorCoa(err) {
        // On 404s, create a new COA as the COA has not been made yet
        if (err && err.json && err.json.status === 404) {
            this.getInstance().performCreateCoaForEdition(this.edition.bitcoin_id);
        } else {
            console.logGlobal(err);
            this.coaMeta.err = err;
        }
    }
}

export default alt.createStore(EditionStore, 'EditionStore');
