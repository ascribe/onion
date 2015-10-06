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
            this.histoy.pushState(null, redirect, this.props.location.query);
        }
    },

    componentDidUpdate() {
        // if user is already logged in, redirect him to piece list
        if(this.state.currentUser && this.state.currentUser.email && this.props.redirectOnLoggedIn
           && this.props.redirectOnLoginSuccess) {
            let { redirectAuthenticated } = this.props.location.query;
            if(redirectAuthenticated) {
                /*
                * redirectAuthenticated contains an arbirary path
                * eg pieces/<id>, editions/<bitcoin_id>, collection, settings, ...
                * hence transitionTo cannot be used directly
                */
                window.location = AppConstants.baseUrl + redirectAuthenticated;
            } else {
                this.history.pushState(null, 'collection');
            }
            
        }
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleSuccess(){
        let notification = new GlobalNotificationModel('Login successful', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        // register_piece is waiting for a login success as login_container and it is wrapped
        // in a slides_container component.
        // The easiest way to check if the user was successfully logged in is to fetch the user
        // in the user store (which is obviously only possible if the user is logged in), since
        // register_piece is listening to the changes of the user_store.
        UserActions.fetchCurrentUser();

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
