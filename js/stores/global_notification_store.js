'use strict';

import { alt } from '../alt';

import GlobalNotificationActions from '../actions/global_notification_actions';

const GLOBAL_NOTIFICATION_COOLDOWN = 400;

class GlobalNotificationStore {
    constructor() {
        this.notificationQueue = [];
        this.notificationStatus = 'ready';
        this.notificationsPaused = false;

        this.bindActions(GlobalNotificationActions);
    }

    onAppendGlobalNotification(newNotification) {
        if (newNotification && newNotification.message) {
            this.notificationQueue.push(newNotification);

            if (!this.notificationsPaused && this.notificationStatus === 'ready') {
                this.showNextNotification();
            }
        }
    }

    showNextNotification() {
        this.notificationStatus = 'show';

        setTimeout(GlobalNotificationActions.cooldownGlobalNotifications, this.notificationQueue[0].dismissAfter);
    }

    onCooldownGlobalNotifications() {
        // When still paused on cooldown, don't shift the queue so we can repeat the current notification.
        if (!this.notificationsPaused) {
            this.notificationStatus = 'cooldown';

            // Leave some time between consecutive notifications
            setTimeout(GlobalNotificationActions.shiftGlobalNotification, GLOBAL_NOTIFICATION_COOLDOWN);
        } else {
            this.notificationStatus = 'ready';
        }
    }

    onShiftGlobalNotification() {
        this.notificationQueue.shift();

        if (!this.notificationsPaused && this.notificationQueue.length > 0) {
            this.showNextNotification();
        } else {
            this.notificationStatus = 'ready';
        }
    }

    onPauseGlobalNotifications() {
        this.notificationsPaused = true;
    }

    onResumeGlobalNotifications() {
        this.notificationsPaused = false;

        if (this.notificationStatus === 'ready' && this.notificationQueue.length > 0) {
            this.showNextNotification();
        }
    }
}

export default alt.createStore(GlobalNotificationStore, 'GlobalNotificationStore');
