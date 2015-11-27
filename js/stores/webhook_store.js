'use strict';

import { alt } from '../alt';
import WebhookActions from '../actions/webhook_actions';

import WebhookSource from '../sources/webhook_source';

class WebhookStore {
    constructor() {
        this.webhooks = [];
        this.webhookEvents = [];
        this.webhookMeta = {
            invalidateCache: false,
            err: null,
            idToDelete: null
        };
        this.webhookEventsMeta = {
            invalidateCache: false,
            err: null
        };

        this.bindActions(WebhookActions);
        this.registerAsync(WebhookSource);
    }

    onFetchWebhooks(invalidateCache) {
        this.webhookMeta.invalidateCache = invalidateCache;
        this.getInstance().lookupWebhooks();
    }

    onSuccessFetchWebhooks({ webhooks }) {
        this.webhookMeta.invalidateCache = false;
        this.webhookMeta.err = null;
        this.webhooks = webhooks;

        this.webhookEventsMeta.invalidateCache = true;
        this.getInstance().lookupWebhookEvents();
    }

    onFetchWebhookEvents(invalidateCache) {
        this.webhookEventsMeta.invalidateCache = invalidateCache;
        this.getInstance().lookupWebhookEvents();
    }

    onSuccessFetchWebhookEvents({ events }) {
        this.webhookEventsMeta.invalidateCache = false;
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

    onRemoveWebhook(id) {
        this.webhookMeta.invalidateCache = true;
        this.webhookMeta.idToDelete = id;

        if(!this.getInstance().isLoading()) {
            this.getInstance().performRemoveWebhook();
        }
    }

    onSuccessRemoveWebhook() {
        this.webhookMeta.idToDelete = null;
        if(!this.getInstance().isLoading()) {
            this.getInstance().lookupWebhooks();
        }
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
