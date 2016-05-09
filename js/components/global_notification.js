'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import GlobalNotificationActions from '../actions/global_notification_actions';
import GlobalNotificationStore from '../stores/global_notification_store';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { mergeOptions } from '../utils/general_utils';

const MAX_NOTIFICATION_BUBBLE_CONTAINER_WIDTH = 768;

let GlobalNotification = React.createClass({

    getInitialState() {
        const notificationStore = GlobalNotificationStore.getState();

        return mergeOptions(
            {
                containerWidth: 0
            },
            notificationStore
        );
    },

    componentDidMount() {
        GlobalNotificationStore.listen(this.onChange);

        // init container width
        this.handleContainerResize();

        // we're using an event listener on window here,
        // as it was not possible to listen to the resize events of a dom node
        window.addEventListener('resize', this.handleContainerResize);
    },

    componentWillUnmount() {
        GlobalNotificationStore.unlisten(this.onChange);
        window.removeEventListener('resize', this.handleContainerResize);
    },

    onChange(state) {
        this.setState(state);
    },

    handleContainerResize() {
        this.setState({
            containerWidth: ReactDOM.findDOMNode(this.refs.notificationWrapper).offsetWidth
        });
    },

    renderNotification() {
        const {
            notificationQueue: [notification],
            notificationStatus,
            notificationsPaused,
            containerWidth } = this.state;

        const notificationClasses = [];

        if (this.state.containerWidth > 768) {
            notificationClasses.push('ascribe-global-notification-bubble');
            notificationClasses.push(notificationStatus === 'show' ? 'ascribe-global-notification-bubble-on'
                                                                   : 'ascribe-global-notification-bubble-off');
        } else {
            notificationClasses.push('ascribe-global-notification');
            notificationClasses.push(notificationStatus === 'show' ? 'ascribe-global-notification-on'
                                                                   : 'ascribe-global-notification-off');
        }

        let textClass;
        let message;
        if (notification && !notificationsPaused) {
            message = notification.message;

            switch(notification.type) {
                case 'success':
                    textClass = 'ascribe-global-notification-success';
                    break;
                case 'danger':
                    textClass = 'ascribe-global-notification-danger';
                    break;
                default:
                    console.warn('Could not find a matching notification type in global_notification.js');
            }
        }

        return (
            <div className={classNames(...notificationClasses)}>
                <div className={textClass}>{message}</div>
            </div>
        );
    },

    render() {
        return (
            <div ref="notificationWrapper">
                <Row>
                    <Col>
                        {this.renderNotification()}
                    </Col>
                </Row>
            </div>
        );
    }
});

export default GlobalNotification;
