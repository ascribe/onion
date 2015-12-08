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

    onSuccessFetchEdition(res) {
        if(res && res.edition) {
            this.edition = res.edition;
            this.editionMeta.err = null;
            this.editionMeta.idToFetch = null;

            if (this.edition.coa && this.edition.acl.acl_coa &&
                typeof this.edition.coa.constructor !== Object) {
                this.getInstance().lookupCoa();
            } else if(!this.edition.coa && this.edition.acl.acl_coa) {
                this.getInstance().performCreateCoa();
            }
        } else {
            this.editionMeta.err = new Error('Problem fetching the edition');
        }
    }

    onSuccessFetchCoa(res) {
        if (res && res.coa && this.edition) {
            this.edition.coa = res.coa;
            this.coaMeta.err = null;
        } else {
            this.coaMeta.err = new Error('Problem generating/fetching the COA');
        }
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
