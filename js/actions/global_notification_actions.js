'use strict';

import { alt } from '../alt';

class GlobalNotificationActions {
    constructor() {
        this.generateActions(
            'appendGlobalNotification',
            'showNextGlobalNotification',
            'shiftGlobalNotification',
            'cooldownGlobalNotifications',
            'pauseGlobalNotifications',
            'resumeGlobalNotifications'
        );
    }
}

export default alt.createActions(GlobalNotificationActions);
