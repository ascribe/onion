'use strict';

import { alt } from '../alt';
import WebhookFetcher from '../fetchers/webhook_fetcher';


class WebhookActions {
    constructor() {
        this.generateActions(
            'updateWebhooks',
            'updateEvents',
            'removeWebhook'
        );
    }

    fetchWebhooks() {
        WebhookFetcher.fetch()
            .then((res) => {
                this.actions.updateWebhooks(res.webhooks);
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }

    fetchWebhookEvents() {
        WebhookFetcher.fetchEvents()
            .then((res) => {
                this.actions.updateEvents(res.events);
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }

    deleteWebhook(id){
        WebhookFetcher.deleteWebhook(id)
            .then((res) => {
                this.actions.removeWebhook(id);
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(WebhookActions);
