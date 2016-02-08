'use strict';

import React from 'react';
import { History } from 'react-router';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import UserActions from '../../actions/user_actions';

import Form from './form';
import Property from './property';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';
import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils';


let LoginForm = React.createClass({
    propTypes: {
        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        location: React.PropTypes.object
    },

    mixins: [History],

    getDefaultProps() {
        return {
            headerMessage: getLangText('Enter') + ' ascribe',
            submitMessage: getLangText('Log in')
        };
    },

    handleSuccess({ success }) {
        const notification = new GlobalNotificationModel(getLangText('Login successful'), 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        if (success) {
            UserActions.fetchCurrentUser(true);
        }
    },

    render() {
        const {
            headerMessage,
            location: { query: { email: emailQuery } },
            submitMessage } = this.props;

        return (
            <Form
                className="ascribe-form-bordered"
                ref="loginForm"
                url={ApiUrls.users_login}
                handleSuccess={this.handleSuccess}
                autoComplete="on"
                buttons={
                    <button
                        type="submit"
                        className="btn btn-default btn-wide">
                        {submitMessage}
                    </button>}
                spinner={
                    <span className="btn btn-default btn-wide btn-spinner">
                        <AscribeSpinner color="dark-blue" size="md" />
                    </span>
                    }>
                <div className="ascribe-form-header">
                    <h3>{headerMessage}</h3>
                </div>
                <Property
                    name='email'
                    label={getLangText('Email')}>
                    <input
                        type="email"
                        placeholder={getLangText('Enter your email')}
                        defaultValue={emailQuery}
                        required/>
                </Property>
                <Property
                    name='password'
                    label={getLangText('Password')}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password')}
                        required/>
                </Property>
            </Form>
        );
    }
});

export default LoginForm;
