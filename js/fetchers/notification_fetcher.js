'use strict';

import requests from '../utils/requests';


let NotificationFetcher = {

    fetchPieceListNotifications() {
        return requests.get('notification_piecelist');
    },

    fetchPieceNotifications(pieceId) {
        return requests.get('notification_piece', {'piece_id': pieceId});
    },

    fetchEditionListNotifications() {
        return requests.get('notification_editionlist');
    },
    
    fetchEditionNotifications(editionId) {
        return requests.get('notification_edition', {'edition_id': editionId});
    }
};

export default NotificationFetcher;
