'use strict';

import requests from '../utils/requests';

let WebhookFetcher = {
    /**
     * Fetch the registered webhooks of a user from the API.
     */
    fetch() {
        return requests.get('webhooks');
    },

    deleteWebhook(id) {
        return requests.delete('webhook', {'webhook_id': id });
    },

    fetchEvents() {
        return requests.get('webhooks_events');
    }

};

export default WebhookFetcher;
