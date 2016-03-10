'use strict';

export default class GlobalNotificationModel {
    constructor(message, type = 'info', dismissAfter = 5000) {
        if (message) {
            this.message = message;
        } else {
            console.logGlobal(new Error('Global notification did not contain a message and was ignored'), {
                dismissAfter,
                type
            });
        }

        if (type === 'info' || type === 'success' || type === 'warning' || type === 'danger') {
            this.type = type;
        } else {
            throw new Error(`A notification's type either has to be info, success, warning, danger. Not: ${type}`);
        }

        this.dismissAfter = dismissAfter;
    }
}
