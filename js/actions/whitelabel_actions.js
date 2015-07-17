'use strict';

import alt from '../alt';
import WhitelabelFetcher from '../fetchers/whitelabel_fetcher';


class WhitelabelActions {
    constructor() {
        this.generateActions(
            'updateWhitelabel'
        );
    }

    fetchWhitelabel() {
        WhitelabelFetcher.fetch()
            .then((res) => {
                if(res && res.whitelabel) {
                    this.actions.updateWhitelabel(res.whitelabel);
                } else {
                    this.actions.updateWhitelabel({});
                }
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(WhitelabelActions);
