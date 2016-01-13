'use strict';

import { alt } from '../alt';

import EditionActions from '../actions/edition_actions';

import EditionSource from '../sources/edition_source';
import CoaSource from '../sources/coa_source';

import { mergeOptions } from '../utils/general_utils';


class EditionStore {
    constructor() {
        this.getInitialState();

        this.bindActions(EditionActions);
        this.registerAsync(mergeOptions(EditionSource, CoaSource));
        this.exportPublicMethods({
            getInitialState: this.getInitialState.bind(this)
        });
    }

    getInitialState() {
        this.edition = {};
        this.editionMeta = {
            err: null,
            idToFetch: null
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

    onFetchEdition(idToFetch) {
        this.editionMeta.idToFetch = idToFetch;

        this.getInstance().lookupEdition();
    }

    onSuccessFetchEdition({ edition }) {
        if (edition) {
            this.edition = edition;
            this.editionMeta.err = null;
            this.editionMeta.idToFetch = null;

            if (this.edition.coa && this.edition.acl.acl_coa &&
                typeof this.edition.coa.constructor !== Object) {
                this.getInstance().lookupCoa();
            } else if (!this.edition.coa && this.edition.acl.acl_coa) {
                this.getInstance().performCreateCoa();
            }
        } else {
            this.editionMeta.err = new Error('Problem fetching the edition');
        }
    }

    onSuccessFetchCoa({ coa }) {
        if (coa && Object.keys(this.edition).length) {
            this.edition.coa = coa;
            this.coaMeta.err = null;
        } else {
            this.coaMeta.err = new Error('Problem generating/fetching the COA');
        }
    }

    onErrorEdition(err) {
        this.editionMeta.err = err;
    }

    onErrorCoa(err) {
        // On 404s, create a new COA as the COA has not been made yet
        if (err && err.json && err.json.status === 404) {
            this.getInstance().performCreateCoa();
        } else {
            this.coaMeta.err = err;
        }
    }

    onFlushEdition() {
        this.getInitialState();
    }
}

export default alt.createStore(EditionStore, 'EditionStore');
