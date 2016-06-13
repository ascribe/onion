'use strict';

import React from 'react';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import UserActions from '../../actions/user_actions';

import Form from './form';
import Property from './property';

import AscribeSpinner from '../ascribe_spinner';
import withContext from '../context/with_context';
import { locationShape } from '../prop_types';

import ApiUrls from '../../constants/api_urls';

import { getLangText } from '../../utils/lang';


let LoginForm = React.createClass({
    propTypes: {
        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        whitelabelName: React.PropTypes.string,

        // Injected through HOCs
        location: locationShape.isRequired // eslint-disable-line react/sort-prop-types
    },

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
        const { headerMessage,
                location: { query: { email: emailQuery } },
                submitMessage,
                whitelabelName } = this.props;

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
                    <h3>{whitelabelName ? `Welcome to ${whitelabelName}` : headerMessage}</h3>
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

export default withContext(LoginForm, 'location');
