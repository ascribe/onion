'use strict';

import alt from '../alt';


class GlobalNotificationActions {
    constructor() {
        this.generateActions(
            'updateGlobalNotification',
            'resetGlobalNotification'
        );
    }
}

export default alt.createActions(GlobalNotificationActions);
