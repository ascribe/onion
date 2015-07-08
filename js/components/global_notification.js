'use strict';

import React from 'react';

import GlobalNotificationStore from '../stores/global_notification_store';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { mergeOptions } from '../utils/general_utils';

let GlobalNotification = React.createClass({

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

    getInititalState() {
        return mergeOptions(
            this.extractFirstElem(GlobalNotificationStore.getState().notificationQue),
            {
                containerWidth: 0
            }
        );
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

    handleContainerResize() {
        this.setState({
            containerWidth: this.refs.containerWrapper.getDOMNode().offsetWidth
        });
    },

    render() {
        console.log(this.state);
        let notificationClass = 'ascribe-global-notification ';
        let message = this.state && this.state.message ? this.state.message : null;

        if(message) {
            let colors = {
                warning: '#f0ad4e',
                success: '#5cb85c',
                info: 'rgba(2, 182, 163, 1)',
                danger: '#d9534f'
            };

            let text = (<div style={{color: colors[this.state.type]}}>{message ? message : null}</div>);

            return (
                <Row>
                    <Col>
                        <div className={notificationClass + 'ascribe-global-notification-on'}>
                            {text}
                        </div>
                    </Col>
                </Row>
            );
        } else {
            return (
                <Row>
                    <Col>
                        <div className={notificationClass + 'ascribe-global-notification-off'} />
                    </Col>
                </Row>
            );
        }
    }
});

export default GlobalNotification;