'use strict';

import React from 'react';

import GlobalNotificationStore from '../stores/global_notification_store';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { mergeOptions } from '../utils/general_utils';

let GlobalNotification = React.createClass({

    getInitialState() {
        return mergeOptions(
            {
                containerWidth: 0,
                type: 'success'
            },
            this.extractFirstElem(GlobalNotificationStore.getState().notificationQue)
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

    extractFirstElem(l) {
        return l.length > 0 ? l[0] : {message: ''};
    },

    onChange(state) {
        let notification = this.extractFirstElem(state.notificationQue);

        if(notification) {
            this.setState(notification);
        } else {
            this.replaceState({
                message: ''
            });
        }
    },

    handleContainerResize() {
        this.setState({
            containerWidth: this.refs.notificationWrapper.getDOMNode().offsetWidth
        });
    },

    render() {
        let notificationClass = 'ascribe-global-notification';
        let textClass;
        let message = this.state && this.state.message ? this.state.message : null;

        if(message) {
            notificationClass += ' ascribe-global-notification-on';
        } else {
            notificationClass += ' ascribe-global-notification-off';
        }

        if(this.state) {
            switch(this.state.type) {
                case 'warning':
                    textClass = 'ascribe-global-notification-warning';
                    break;
                case 'success':
                    textClass = 'ascribe-global-notification-success';
                    break;
                case 'info':
                    textClass = 'ascribe-global-notification-info';
                    break;
                case 'danger':
                    textClass = 'ascribe-global-notification-danger';
                    break;
                default:
                    console.warn('Could not find a matching type in global_notification.js');
            }
        }

        return (
            <div ref="notificationWrapper">
                <Row>
                    <Col>
                        <div className={notificationClass}>
                            <div className={textClass}>{message ? message : null}</div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
});

export default GlobalNotification;