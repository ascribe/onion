'use strict';

import requests from '../utils/requests';

import WebhookActions from '../actions/webhook_actions';


const WebhookSource = {
    lookupWebhooks: {
        remote() {
            return requests.get('webhooks');
        },

        local(state) {
            return !Object.keys(state.webhooks).length ? state : {};
        },

        success: WebhookActions.successFetchWebhooks,
        error: WebhookActions.errorWebhooks,

        shouldFetch(state, invalidateCache) {
            return invalidateCache || !Object.keys(state.webhooks).length;
        }
    },

    lookupWebhookEvents: {
        remote() {
            return requests.get('webhooks_events');
        },

        local(state) {
            return !Object.keys(state.webhookEvents).length ? state : {};
        },

        success: WebhookActions.successFetchWebhookEvents,
        error: WebhookActions.errorWebhookEvents,

        shouldFetch(state, invalidateCache) {
            return invalidateCache || !Object.keys(state.webhookEvents).length;
        }
    },

    performRemoveWebhook: {
        remote(state, webhookId) {
            return requests.delete('webhook', { 'webhook_id': webhookId });
        },

        success: WebhookActions.successRemoveWebhook,
        error: WebhookActions.errorWebhooks
    }
};

export default WebhookSource;
