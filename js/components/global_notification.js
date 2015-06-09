'use strict';

import React from 'react';

import GlobalNotificationStore from '../stores/global_notification_store';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

let GlobalNotification = React.createClass({

    componentDidMount() {
        GlobalNotificationStore.listen(this.onChange);
    },

    componentWillUnmount() {
        GlobalNotificationStore.unlisten(this.onChange);
    },

    getInititalState() {
        return this.extractFirstElem(GlobalNotificationStore.getState().notificationQue);
    },

    extractFirstElem(l) {
        return l.length > 0 ? l[0] : null;
    },

    onChange(state) {
        let notification = this.extractFirstElem(state.notificationQue);

        if(notification) {
            this.setState(notification);
        } else {
            this.replaceState(null);
        }
    },

    render() {
        let className = 'ascribe-global-notification ';
        let message = this.state && this.state.message ? this.state.message : null;

        className += message ? 'ascribe-global-notification-on' : 'ascribe-global-notification-off';

        return (
            <Row>
                <Col>
                    <div className={className}>
                        <div>{message ? message : null}</div>
                    </div>
                </Col>
            </Row>
        );
    }
});

export default GlobalNotification;