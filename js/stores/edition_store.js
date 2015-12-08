'use strict';

import { alt } from '../alt';

import EditionActions from '../actions/edition_actions';
import EditionSource from '../sources/edition_source';


class EditionStore {
    constructor() {
        this.edition = null;
        this.editionMeta = {
            err: null,
            idToFetch: null
        };
        this.coaMeta = {
            err: null
        };

        this.bindActions(EditionActions);
        this.registerAsync(EditionSource);
    }

    onFetchEdition(idToFetch) {
        this.editionMeta.idToFetch = idToFetch;

        if(!this.getInstance().isLoading()) {
            this.getInstance().lookupEdition();
        }
    }

    onSuccessFetchEdition({ edition }) {
        this.editionMeta.err = null;
        this.editionMeta.idToFetch = null;
        this.edition = edition;

        if(this.edition && this.edition.coa && typeof this.edition.coa.constructor !== Object) {
            this.getInstance().lookupCoa();
        } else if(this.edition && !this.edition.coa && this.edition.acl.acl_coa) {
            this.getInstance().performCreateCoa();
        }
    }

    onSuccessFetchCoa({ coa }) {
        this.coaMeta.err = null;
        this.edition.coa = coa;
    }

    onFlushEdition() {
        this.edition = null;
        this.editionMeta = {
            err: null,
            idToFetch: null
        };
        this.coaMeta = {
            err: null
        };
    }

    onErrorEdition(err) {
        this.editionMeta.err = err;
    }

    onErrorCoa(err) {
        this.coaMeta.err = err;
    }
}

export default alt.createStore(EditionStore, 'EditionStore');
