'use strict';

import { alt } from '../alt';
import Q from 'q';

import NotificationFetcher from '../fetchers/notification_fetcher';

class NotificationActions {
    constructor() {
        this.generateActions(
            'updatePieceListNotifications',
            'flushPieceListNotifications',
            'updateEditionListNotifications',
            'flushEditionListNotifications',
            'updatePieceNotifications',
            'updateEditionNotifications',
            'updateContractAgreementListNotifications',
            'flushContractAgreementListNotifications'
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

    fetchContractAgreementListNotifications() {
        return Q.Promise((resolve, reject) => {
                NotificationFetcher
                    .fetchContractAgreementListNotifications()
                    .then((res) => {
                        this.actions.updateContractAgreementListNotifications(res);
                        resolve(res);
                    })
                    .catch((err) => console.logGlobal(err));
        });
    }
}

export default alt.createActions(NotificationActions);
