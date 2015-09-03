'use strict';

import alt from '../alt';

import NotificationFetcher from '../fetchers/notification_fetcher';

class NotificationActions {
    constructor() {
        this.generateActions(
            'updatePieceListNotifications',
            'updateEditionListNotifications'
        );
    }

    fetchPieceListNotifications() {
        NotificationFetcher
            .fetchPieceListNotifications()
            .then((res) => {
                this.actions.updatePieceListNotifications(res);
            })
            .catch((err) => console.logGlobal(err));
    }

    fetchEditionListNotifications() {
        NotificationFetcher
            .fetchEditionListNotifications()
            .then((res) => {
                this.actions.updateEditionListNotifications(res);
            })
            .catch((err) => console.logGlobal(err));
    }
}

export default alt.createActions(NotificationActions);
