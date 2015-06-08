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
        GlobalNotificationStore.listen(this.onChange);
    },

    getInititalState() {
        return GlobalNotificationStore.getState();
    },

    onChange(state) {
        this.setState(state);
        if(state.message && state.dismissAfter) {
            setTimeout(GlobalNotificationActions.resetGlobalNotification, state.dismissAfter);
        }
    },

    onClick() {
        if(this.state.onClick) {
            this.state.onClick();
        }
        GlobalNotificationActions.resetGlobalNotification();
    },

    render() {
        let className = 'ascribe-global-notification ';
        className += this.state && this.state.message ? 'ascribe-global-notification-on' : 'ascribe-global-notification-off';

         return (
            <Row onClick={this.onClick}>
                <Col>
                    <div className={className}>
                        <div>{this.state ? this.state.message : null}</div>
                    </div>
                </Col>
            </Row>
        );
    }
});

export default GlobalNotification;