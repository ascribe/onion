'use strict';

import React from 'react';

import ModalWrapper from './modal_wrapper';
import SignupForm from '../ascribe_forms/form_signup';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

let SignupModal = React.createClass({
    handleSignupSuccess(response){
        let notificationText = 'We sent an email to your address ' + response.user.email + ', please confirm.';
        let notification = new GlobalNotificationModel(notificationText, 'success', 50000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        return (
            <ModalWrapper
                button={this.props.button}
                title='Create an account'
                handleSuccess={this.handleSignupSuccess}
                tooltip='Sign up to ascribe'>
                <SignupForm />
            </ModalWrapper>
        );
    }
});

export default SignupModal;
