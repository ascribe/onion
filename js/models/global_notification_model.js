'use strict';

export default class GlobalNotificationModel {
    constructor(message, type = 'success', dismissAfter = 5000) {
        if (type !== 'success' && type !== 'danger') {
            throw new Error(`A notification's type either has to be success, or danger. Not: ${type}`);
        }

        if (message) {
            this.message = message;
        } else {
            console.logGlobal(new Error('Global notification did not contain a message and was ignored'), {
                dismissAfter,
                type
            });
        }

        this.dismissAfter = dismissAfter;
        this.type = type;
    }
}
