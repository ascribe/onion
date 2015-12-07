'use strict';

import { alt } from '../alt';


class WebhookActions {
    constructor() {
        this.generateActions(
            'fetchWebhooks',
            'successFetchWebhooks',
            'fetchWebhookEvents',
            'successFetchWebhookEvents',
            'removeWebhook',
            'successRemoveWebhook'
        );
    }
}

export default alt.createActions(WebhookActions);
