'use strict';

import history from '../history';
import { altThirdParty } from '../alt';

import EventActions from '../actions/event_actions';

import NotificationActions from '../actions/notification_actions';

import { getSubdomain } from '../utils/url_utils';


class NotificationsHandler {
    constructor() {
        this.bindActions(EventActions);
        this.loaded = false;
    }

    onUserDidAuthenticate() {
        if (this.loaded) {
            return;
        }

        const subdomain = getSubdomain();
        if (subdomain === 'ikonotv') {
            NotificationActions.fetchContractAgreementListNotifications().then(
                (res) => {
                    if (res.notifications && res.notifications.length > 0) {
                        console.log('Contractagreement notifications loaded');
                        this.loaded = true;

                        history.push('/contract_notifications');
                    }
                }
            );
        }
        this.loaded = true;
    }

    onUserDidLogout() {
        this.loaded = false;
    }
}

export default altThirdParty.createStore(NotificationsHandler, 'NotificationsHandler');
