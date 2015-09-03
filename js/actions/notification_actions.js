'use strict';

import alt from '../alt';

import NotificationFetcher from '../fetchers/notification_fetcher';

class NotificationActions {
    constructor() {
        this.generateActions(
            'updatePieceListNotifications',
            'updateEditionListNotifications',
            'updateEditionNotifications',
            'updatePieceNotifications'
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

    fetchPieceNotifications(pieceId) {
        NotificationFetcher
            .fetchPieceNotifications(pieceId)
            .then((res) => {
                this.actions.updatePieceNotifications(res);
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

    fetchEditionNotifications(editionId) {
        NotificationFetcher
            .fetchEditionNotifications(editionId)
            .then((res) => {
                this.actions.updateEditionNotifications(res);
            })
            .catch((err) => console.logGlobal(err));
    }
}

export default alt.createActions(NotificationActions);
