'use strict';

import React from 'react';
import { History } from 'react-router';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import UserStore from '../../stores/user_store';
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
        redirectOnLoggedIn: React.PropTypes.bool,
        redirectOnLoginSuccess: React.PropTypes.bool,
        location: React.PropTypes.object
    },

    mixins: [History],

    getDefaultProps() {
        return {
            headerMessage: getLangText('Enter ascribe'),
            submitMessage: getLangText('Log in'),
            redirectOnLoggedIn: true,
            redirectOnLoginSuccess: true
        };
    },

    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleSuccess({ success }){
        let notification = new GlobalNotificationModel('Login successful', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        if(success) {
            UserActions.fetchCurrentUser();
        }
    },

    render() {
        let email = this.props.location.query.email || null;
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
                        {this.props.submitMessage}
                    </button>}
                spinner={
                    <span className="btn btn-default btn-wide btn-spinner">
                        <AscribeSpinner color="dark-blue" size="md" />
                    </span>
                    }>
                <div className="ascribe-form-header">
                    <h3>{this.props.headerMessage}</h3>
                </div>
                <Property
                    name='email'
                    label={getLangText('Email')}>
                    <input
                        type="email"
                        placeholder={getLangText('Enter your email')}
                        name="email"
                        defaultValue={email}
                        required/>
                </Property>
                <Property
                    name='password'
                    label={getLangText('Password')}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password')}
                        name="password"
                        required/>
                </Property>
            </Form>
        );
    }
});

export default LoginForm;
