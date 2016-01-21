'use strict';

import { alt } from '../alt';

import WebhookActions from '../actions/webhook_actions';

import WebhookSource from '../sources/webhook_source';

class WebhookStore {
    constructor() {
        this.webhooks = [];
        this.webhookEvents = [];
        this.webhookMeta = {
            err: null
        };
        this.webhookEventsMeta = {
            err: null
        };

        this.bindActions(WebhookActions);
        this.registerAsync(WebhookSource);
    }

    onFetchWebhooks(invalidateCache) {
        if (invalidateCache || !this.getInstance().isLoading()) {
            this.getInstance().lookupWebhooks(invalidateCache);
        }

        // Prevent alt from sending an empty change event when a request is sent
        // off to the source
        this.preventDefault();
    }

    onSuccessFetchWebhooks({ webhooks = [] }) {
        this.webhookMeta.err = null;
        this.webhooks = webhooks;

        this.onFetchWebhookEvents(true);
    }

    onFetchWebhookEvents(invalidateCache) {
        if (invalidateCache || !this.getInstance().isLoading()) {
            this.getInstance().lookupWebhookEvents(invalidateCache);
        }

        // Prevent alt from sending an empty change event when a request is sent
        // off to the source
        this.preventDefault();
    }

    onSuccessFetchWebhookEvents({ events }) {
        this.webhookEventsMeta.err = null;

        // remove all events that have already been used.
        const usedEvents = this.webhooks
                               .reduce((tempUsedEvents, webhook) => {
                                   tempUsedEvents.push(webhook.event.split('.')[0]);
                                   return tempUsedEvents;
                               }, []);

        this.webhookEvents = events.filter((event) => {
            return usedEvents.indexOf(event) === -1;
        });
    }

    onRemoveWebhook(webhookId) {
        this.getInstance().performRemoveWebhook(webhookId);

        // Prevent alt from sending an empty change event when a request is sent
        // off to the source
        this.preventDefault();
    }

    onSuccessRemoveWebhook() {
        this.getInstance().lookupWebhooks(true);
    }

    onErrorWebhooks(err) {
        console.logGlobal(err);
        this.webhookMeta.err = err;
    }

    onErrorWebhookEvents(err) {
        console.logGlobal(err);
        this.webhookEventsMeta.err = err;
    }
}

export default alt.createStore(WebhookStore, 'WebhookStore');
