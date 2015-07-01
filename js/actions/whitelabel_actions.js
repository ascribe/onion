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
                this.actions.updateWhitelabel(res.whitelabel);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export default alt.createActions(WhitelabelActions);
