'use strict';

import request from '../utils/request';


let NotificationFetcher = {
    fetchPieceListNotifications() {
        return request('notification_piecelist');
    },

    fetchPieceNotifications(pieceId) {
        return request('notification_piece', {
            urlTemplateSpec: { pieceId }
        });
    },

    fetchEditionListNotifications() {
        return request('notification_editionlist');
    },

    fetchEditionNotifications(editionId) {
        return request('notification_edition', {
            urlTemplateSpec: { editionId }
        });
    },

    fetchContractAgreementListNotifications() {
        return request('notification_contract_agreement_list');
    }
};

export default NotificationFetcher;
