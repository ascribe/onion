'use strict';

import React from 'react';
import Router from 'react-router';

import PasswordResetForm from './ascribe_forms/form_password_reset';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

let PasswordResetContainer = React.createClass({
    mixins: [Router.Navigation],

    handleSuccess(){
        this.transitionTo('pieces');
        let notification = new GlobalNotificationModel('password succesfully updated', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },
    render() {
        return (
            <PasswordResetForm
                email={this.props.query.email}
                token={this.props.query.token}
                handleSuccess={this.handleSuccess}
            />
      );
  }
});

export default PasswordResetContainer;