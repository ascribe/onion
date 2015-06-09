'use strict';

export default class GlobalNotificationModel {
    constructor(message, dismissAfter) {
        if(!message) {
            throw new Error('A notifications message must be defined.');
        } else {
            this.message = message;
        }

        this.dismissAfter = dismissAfter ? dismissAfter : 0;
    }
}