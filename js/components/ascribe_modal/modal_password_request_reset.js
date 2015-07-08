'use strict';

import React from 'react';

import ModalWrapper from './modal_wrapper';
import PasswordResetRequestForm from '../ascribe_forms/form_password_reset_request';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';
import { getLangText } from '../../utils/lang_utils.js'

let PasswordResetRequestModal = React.createClass({
    handleResetSuccess(){
        let notificationText = getLangText('Request successfully sent, check your email');
        let notification = new GlobalNotificationModel(notificationText, 'success', 50000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },
    render() {
        return (
            <ModalWrapper
                button={this.props.button}
                title={getLangText('Reset your password')}
                handleSuccess={this.handleResetSuccess}
                tooltip={getLangText('Reset your password')}>
                <PasswordResetRequestForm />
            </ModalWrapper>
        );
    }
});

export default PasswordResetRequestModal;
