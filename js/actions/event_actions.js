'use strict';

import { altThirdParty } from '../alt';


class EventActions {
    constructor() {
        this.generateActions(
            'applicationWillBoot',
            'applicationDidBoot',
            'profileDidLoad',
            //'userDidLogin',
            //'userDidLogout',
            'routeDidChange'
        );
    }
}

export default altThirdParty.createActions(EventActions);
