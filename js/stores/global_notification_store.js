'use strict';

import alt from '../alt';

import GlobalNotificationActions from '../actions/global_notification_actions';

class GlobalNotificationStore {
    constructor() {
        this.message = '';
        this.action = '';
        this.styles = {};
        this.onClick = null;
        this.dismissAfter = 0;

        this.bindActions(GlobalNotificationActions);
    }

    onUpdateGlobalNotification({message, action, styles, onClick, dismissAfter}) {
        if(!message) {
            throw new Error('A notifications message must be defined.');
        } else {
            this.message = message;
        }

        this.action = action ? action : '';
        this.styles = styles ? styles : {};
        this.onClick = onClick ? onClick : null;
        this.dismissAfter = dismissAfter ? dismissAfter : 0;
    }

    onResetGlobalNotification() {
        this.message = '';
        this.action = '';
        this.styles = {};
        this.onClick = null;
        this.dismissAfter = 0;
    }
}

export default alt.createStore(GlobalNotificationStore);
