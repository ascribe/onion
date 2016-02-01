'use strict';

import { altThirdParty } from '../alt';


class FacebookActions {
    constructor() {
        this.generateActions(
            'sdkReady'
        );
    }
}

export default altThirdParty.createActions(FacebookActions);
