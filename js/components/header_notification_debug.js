'use strict';

import React from 'react';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import MenuItem from 'react-bootstrap/lib/MenuItem';

/*
    This components purpose is to be inserted into the page's navigation in order
    debug the globalnotificationsaction easily

 */
let HeaderNotificationDebug = React.createClass({

    triggerNotification() {
        let notification = new GlobalNotificationModel('this is a test, please ignore', 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        return (
            <MenuItem onClick={this.triggerNotification}>Notification</MenuItem>
        );
    }
});

export default HeaderNotificationDebug;