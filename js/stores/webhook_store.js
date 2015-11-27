'use strict';

import { alt } from '../alt';
import WebhookActions from '../actions/webhook_actions';


class WebhookStore {
    constructor() {
        this.webhooks = {};
        this.events = {};
        this.bindActions(WebhookActions);
    }

    onUpdateWebhooks(webhooks) {
        this.webhooks = webhooks;
    }

    onUpdateEvents(events) {
        this.events = events;
    }

    onRemoveWebhook(id) {
       this.webhooks = this.webhooks.filter((webhook) => webhook.id !== parseInt(id));
    }
}

export default alt.createStore(WebhookStore, 'WebhookStore');
