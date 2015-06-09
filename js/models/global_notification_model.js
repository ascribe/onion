'use strict';

export default class GlobalNotificationModel {
    constructor(message, type = 'info', dismissAfter = 3500) {
        if(message) {
            this.message = message;
        } else {
            throw new Error('A notifications message must be defined.');
        }

        if(type === 'info' || type === 'success' || type === 'warning' || type === 'danger') {
            this.type = type;
        } else {
            throw new Error('A notification\'s type either has to be info, success, warning, danger. Not: ' + type);
        }

        this.dismissAfter = dismissAfter;
    }
}