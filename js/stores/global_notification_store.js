'use strict';

import { alt } from '../alt';

import GlobalNotificationActions from '../actions/global_notification_actions';

class GlobalNotificationStore {
    constructor() {
        this.notificationQue = [];

        this.bindActions(GlobalNotificationActions);
    }

    onAppendGlobalNotification(newNotification) {
        let notificationDelay = 0;
        for(let i = 0; i < this.notificationQue.length; i++) {
            notificationDelay += this.notificationQue[i].dismissAfter;
        }

        this.notificationQue.push(newNotification);
        setTimeout(GlobalNotificationActions.emulateEmptyStore, notificationDelay + newNotification.dismissAfter);
    }

    onEmulateEmptyStore() {
        let actualNotificitionQue = this.notificationQue.slice();

        this.notificationQue = [];

        setTimeout(() => {
            this.notificationQue = actualNotificitionQue.slice();
            GlobalNotificationActions.shiftGlobalNotification();
        }, 400);
    }

    onShiftGlobalNotification() {
        this.notificationQue.shift();
    }
}

export default alt.createStore(GlobalNotificationStore, 'GlobalNotificationStore');
