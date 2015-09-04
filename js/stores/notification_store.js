'use strict';

import React from 'react';
import alt from '../alt';

import NotificationActions from '../actions/notification_actions';


class NotificationStore {
    constructor() {
        this.pieceListNotifications = {};
        this.editionListNotifications = {};
        this.contractAgreementListNotifications = {};
        this.editionNotifications = null;
        this.pieceNotifications = null;
        this.bindActions(NotificationActions);
    }

    onUpdatePieceListNotifications(res) {
        this.pieceListNotifications = res.notifications;
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

}

export default alt.createStore(NotificationStore, 'NotificationStore');
