'use strict';

import { alt } from '../alt';

import EditionActions from '../actions/edition_actions';

import EditionSource from '../sources/edition_source';
import CoaSource from '../sources/coa_source';

import { safeMerge } from '../utils/general';


class EditionStore {
    constructor() {
        this.getInitialState();

        this.bindActions(EditionActions);
        this.registerAsync(safeMerge(EditionSource, CoaSource));
        this.exportPublicMethods({
            getInitialState: this.getInitialState.bind(this)
        });
    }

    getInitialState() {
        this.edition = {};
        this.editionMeta = {
            err: null
        };
        this.coaMeta = {
            err: null
        };

        return {
            edition: this.edition,
            editionMeta: this.editionMeta,
            coaMeta: this.coaMeta
        };
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

    onFlushEdition() {
        this.getInitialState();
    }
}

export default alt.createStore(EditionStore, 'EditionStore');
