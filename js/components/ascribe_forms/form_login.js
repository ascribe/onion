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
        let { redirect } = this.props.location.query;
        if (redirect && redirect !== 'login'){
            this.histoy.pushState(null, '/' + redirect, this.props.location.query);
        }
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

        if(success && this.props.redirectOnLoggedIn && this.props.redirectOnLoginSuccess) {
            let { redirectAuthenticated } = this.props.location.query;
            if(redirectAuthenticated) {
                /*
                * redirectAuthenticated contains an arbirary path
                * eg pieces/<id>, editions/<bitcoin_id>, collection, settings, ...
                * hence transitionTo cannot be used directly
                */
                window.location = AppConstants.baseUrl + redirectAuthenticated;
            } else {
                /* Taken from http://stackoverflow.com/a/14916411 */
                /*
                 We actually have to trick the Browser into showing the "save password" dialog
                 as Chrome expects the login page to be reloaded after the login.
                 Users on Stack Overflow claim this is a bug in chrome and should be fixed in the future.
                 Until then, we redirect the HARD way, but reloading the whole page using window.location
                */
                window.location = AppConstants.baseUrl + 'collection';
            }
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
                        className="btn ascribe-btn ascribe-btn-login">
                        {this.props.submitMessage}
                    </button>}
                spinner={
                    <span className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
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
