'use strict';

import { altThirdParty } from '../alt';


class EventActions {
    constructor() {
        this.generateActions(
            'applicationWillBoot',
            'applicationDidBoot',
            'userDidAuthenticate',
            'userDidLogout',
            'routeDidChange'
        );
    }
}

export default altThirdParty.createActions(EventActions);
