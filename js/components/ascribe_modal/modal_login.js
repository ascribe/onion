'use strict';

import React from 'react';

import ModalWrapper from './modal_wrapper';
import LoginForm from '../ascribe_forms/form_login';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

let LoginModal = React.createClass({
    handleLoginSuccess(){
        this.props.handleSuccess();
        let notificationText = 'Login successful';
        let notification = new GlobalNotificationModel(notificationText, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        return (
            <ModalWrapper
                button={this.props.button}
                title='Log in to ascribe'
                handleSuccess={this.handleLoginSuccess}
                tooltip='Log in to ascribe'>
                <LoginForm />
            </ModalWrapper>
        );
    }
});

export default LoginModal;
