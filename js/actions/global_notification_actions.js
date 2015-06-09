'use strict';

import alt from '../alt';


class GlobalNotificationActions {
    constructor() {
        this.generateActions(
            'appendGlobalNotification',
            'shiftGlobalNotification',
            'emulateEmptyStore'
        );
    }
}

export default alt.createActions(GlobalNotificationActions);
