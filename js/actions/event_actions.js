'use strict';

import alt from '../alt';


class EventActions {
    constructor() {
        this.generateActions(
            'applicationWillBoot',
            'applicationDidBoot',
            'profileDidLoad',
            'userDidLogin',
            'userDidLogout',
            'routeDidChange'
        );
    }
}

export default alt.createActions(EventActions);
