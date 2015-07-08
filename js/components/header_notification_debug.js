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

    propTypes: {
        show: React.PropTypes.bool
    },

    getInitialState() {
        return {
            index: 0
        };
    },

    triggerNotification() {
        if(this.state.index === 1) {
            this.setState({index: 0});
        } else {
            this.setState({index: this.state.index + 1});
        }

        let actions = ['success', 'danger'];

        let notification = new GlobalNotificationModel('this is a test, please ignore', actions[this.state.index]);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        if(this.props.show) {
            return (
                <MenuItem onClick={this.triggerNotification}>Notification</MenuItem>
            );
        } else {
            return null;
        }
    }
});

export default HeaderNotificationDebug;