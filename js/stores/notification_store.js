'use strict';

import React from 'react';
import alt from '../alt';

import NotificationActions from '../actions/notification_actions';


class NotificationStore {
    constructor() {
        this.pieceListNotifications = {};
        this.editionListNotifications = {};
        this.bindActions(NotificationActions);
    }

    onUpdatePieceListNotifications(res) {
        this.pieceListNotifications = res.notifications;
    }

    onUpdateEditionListNotifications(res) {
        this.editionListNotifications = res.notifications;
    }

}

export default alt.createStore(NotificationStore, 'NotificationStore');
