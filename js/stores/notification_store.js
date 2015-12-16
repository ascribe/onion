'use strict';

import React from 'react';
import { alt } from '../alt';

import NotificationActions from '../actions/notification_actions';


class NotificationStore {
    constructor() {
        this.pieceListNotifications = [];
        this.pieceNotifications = null;
        this.editionListNotifications = [];
        this.editionNotifications = null;

        // Need to determine if contract agreement notifications have been loaded or not,
        // so we use null here instead of an empty array
        this.contractAgreementListNotifications = null;

        this.bindActions(NotificationActions);
    }

    onUpdatePieceListNotifications(res) {
        this.pieceListNotifications = res.notifications;
    }

    onFlushPieceListNotifications() {
        this.pieceListNotifications = [];
    }

    onUpdatePieceNotifications(res) {
        this.pieceNotifications = res.notification;
    }

    onUpdateEditionListNotifications(res) {
        this.editionListNotifications = res.notifications;
    }

    onUpdateEditionNotifications(res) {
        this.editionNotifications = res.notification;
    }

    onUpdateContractAgreementListNotifications(res) {
        this.contractAgreementListNotifications = res.notifications;
    }

    onFlushContractAgreementListNotifications() {
        this.contractAgreementListNotifications = null;
    }
}

export default alt.createStore(NotificationStore, 'NotificationStore');
