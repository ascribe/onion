'use strict';

import requests from '../utils/requests';


let NotificationFetcher = {

    fetchPieceListNotifications() {
        return requests.get('notification_piecelist');
    },

    fetchEditionListNotifications() {
        return requests.get('notification_editionlist');
    }
};

export default NotificationFetcher;
