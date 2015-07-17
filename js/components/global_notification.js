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
                containerWidth: 0
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
        if(l.length > 0) {
            return {
                show: true,
                message: l[0]
            };
        } else {
            return {
                show: false,
                message: ''
            };
        }
    },

    onChange(state) {
        let notification = this.extractFirstElem(state.notificationQue);

        // error handling for notifications
        if(notification.message && notification.type === 'danger') {
            console.logGlobal(new Error(notification.message.message));
        }

        if(notification.show) {
            this.setState(notification);
        } else {
            this.setState({
                show: false
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

        if(this.state.containerWidth > 768) {
            notificationClass = 'ascribe-global-notification-bubble';

            if(this.state.show) {
                notificationClass += ' ascribe-global-notification-bubble-on';
            } else {
                notificationClass += ' ascribe-global-notification-bubble-off';
            }

        } else {
            notificationClass = 'ascribe-global-notification';

            if(this.state.show) {
                notificationClass += ' ascribe-global-notification-on';
            } else {
                notificationClass += ' ascribe-global-notification-off';
            }

        }

        if(this.state.message) {
            switch(this.state.message.type) {
                case 'success':
                    textClass = 'ascribe-global-notification-success';
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
                            <div className={textClass}>{this.state.message.message}</div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
});

export default GlobalNotification;