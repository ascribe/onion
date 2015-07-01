'use strict';

import React from 'react';
import Router from 'react-router';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import UserStore from '../stores/user_store';
import UserActions from '../actions/user_actions';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';

import apiUrls from '../constants/api_urls';
import AppConstants from '../constants/application_constants';

import { getLangText } from '../utils/lang_utils';

let Link = Router.Link;

let LoginContainer = React.createClass({
    propTypes: {
        message: React.PropTypes.string,
        redirectOnLoggedIn: React.PropTypes.bool,
        redirectOnLoginSuccess: React.PropTypes.bool
    },

    mixins: [Router.Navigation],

    getDefaultProps() {
        return {
            message: getLangText('Log in to') + ' ascribe ...'
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

        // if user is already logged in, redirect him to piece list
        if(this.state.currentUser && this.state.currentUser.email && this.props.redirectOnLoggedIn) {
            this.transitionTo('pieces');
        }
    },

    render() {
        return (
            <div className="ascribe-login-wrapper">
                <br/>
                <div className="ascribe-login-text ascribe-login-header">
                    {this.props.message}
                </div>
                <LoginForm />
            </div>
        );
    }
});


let LoginForm = React.createClass({
    propTypes: {
        redirectOnLoginSuccess: React.PropTypes.bool
    },

    handleSuccess(){
        let notification = new GlobalNotificationModel('Login successsful', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        // register_piece is waiting for a login success as login_container and it is wrapped
        // in a slides_container component.
        // The easiest way to check if the user was successfully logged in is to fetch the user
        // in the user store (which is obviously only possible if the user is logged in), since
        // register_piece is listening to the changes of the user_store.
        UserActions.fetchCurrentUser();

        /* Taken from http://stackoverflow.com/a/14916411 */
        /*
        We actually have to trick the Browser into showing the "save password" dialog
        as Chrome expects the login page to be reloaded after the login.
        Users on Stack Overflow claim this is a bug in chrome and should be fixed in the future.
        Until then, we redirect the HARD way, but reloading the whole page using window.location
        */
        if(this.props.redirectOnLoginSuccess) {
            window.location = AppConstants.baseUrl + 'collection';
        }
    },

    render() {
        return (
            <Form
                ref="loginForm"
                url={apiUrls.users_login}
                handleSuccess={this.handleSuccess}
                buttons={
                    <button
                        type="submit"
                        className="btn ascribe-btn ascribe-btn-login">
                        {getLangText('Log in to')} ascribe
                    </button>}
                spinner={
                    <button className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                    </button>
                    }>
                <Property
                    name='email'
                    label={getLangText('Email')}>
                    <input
                        type="email"
                        placeholder={getLangText('Enter your email')}
                        autoComplete="on"
                        name="username"
                        required/>
                </Property>
                <Property
                    name='password'
                    label={getLangText('Password')}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password')}
                        autoComplete="on"
                        name="password"
                        required/>
                </Property>
                <hr />
                <div className="ascribe-login-text">
                    {getLangText('Not an ascribe user')}&#63; <Link to="signup">{getLangText('Sign up')}...</Link><br/>
                    {getLangText('Forgot my password')}&#63; <Link to="password_reset">{getLangText('Rescue me')}...</Link>
                </div>
            </Form>
        );
    }
});


export default LoginContainer;
