'use strict';

import alt from '../alt';
import EventActions from '../actions/event_actions';

import NotificationActions from '../actions/notification_actions';


class NotificationsHandler {

    constructor() {
        this.bindActions(EventActions);
        this.loaded = false;
    }

    onProfileDidLoad(profile) {
        if (this.loaded) {
            return;
        }
        let subdomain = window.location.host.split('.')[0];
        if (subdomain === 'ikonotv') {
            NotificationActions.fetchContractAgreementListNotifications().then(
                (res) => {
                    if (res.notifications && res.notifications.length > 0) {
                        this.loaded = true;
                        console.log('Contractagreement notifications loaded');
                        setTimeout(() => window.appRouter.transitionTo('contract_notifications'), 0);
                    }
                }
            );
        }
        this.loaded = true;
    }
}

export default alt.createStore(NotificationsHandler, 'NotificationsHandler');
