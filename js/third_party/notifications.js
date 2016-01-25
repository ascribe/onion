'use strict';

import history from '../history';
import { altThirdParty } from '../alt';


import EventActions from '../actions/event_actions';

import NotificationActions from '../actions/notification_actions';

import { getSubdomain } from '../utils/general_utils';


class NotificationsHandler {
    constructor() {
        this.bindActions(EventActions);
        this.loaded = false;
    }

    onProfileDidLoad() {
        if (this.loaded) {
            return;
        }

        let subdomain = getSubdomain();
        if (subdomain === 'ikonotv') {
            NotificationActions.fetchContractAgreementListNotifications().then(
                (res) => {
                    if (res.notifications && res.notifications.length > 0) {
                        this.loaded = true;
                        console.log('Contractagreement notifications loaded');
                        history.push({ pathname: '/contract_notifications' });
                    }
                }
            );
        }
        this.loaded = true;
    }
}

export default altThirdParty.createStore(NotificationsHandler, 'NotificationsHandler');
