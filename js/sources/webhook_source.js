'use strict';

import requests from '../utils/requests';

import WebhookActions from '../actions/webhook_actions';


const WebhookSource = {
    lookupWebhooks: {
        remote() {
            return requests.get('webhooks');
        },
        local(state) {
            return state.webhooks && !Object.keys(state.webhooks).length ? state : {};
        },
        success: WebhookActions.successFetchWebhooks,
        error: WebhookActions.errorWebhooks,
        shouldFetch(state) {
            return state.webhookMeta.invalidateCache || state.webhooks && !Object.keys(state.webhooks).length;
        }
    },

    lookupWebhookEvents: {
        remote() {
            return requests.get('webhooks_events');
        },
        local(state) {
            return state.webhookEvents && !Object.keys(state.webhookEvents).length ? state : {};
        },
        success: WebhookActions.successFetchWebhookEvents,
        error: WebhookActions.errorWebhookEvents,
        shouldFetch(state) {
            return state.webhookEventsMeta.invalidateCache || state.webhookEvents && !Object.keys(state.webhookEvents).length;
        }
    },

    performRemoveWebhook: {
        remote(state) {
            return requests.delete('webhook', {'webhook_id': state.webhookMeta.idToDelete });
        },
        success: WebhookActions.successRemoveWebhook,
        error: WebhookActions.errorWebhooks
    }
};

export default WebhookSource;