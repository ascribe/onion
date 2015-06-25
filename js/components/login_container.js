'use strict';

import React from 'react';
import Router from 'react-router';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import UserStore from '../stores/user_store';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';

import apiUrls from '../constants/api_urls';


let LoginContainer = React.createClass({
    mixins: [Router.Navigation],

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
        if(this.state.currentUser && this.state.currentUser.email) {
            this.transitionTo('pieces');
        }
    },

    render() {
        return (
            <div className="ascribe-login-wrapper">
                <br/>
                <div className="ascribe-login-text ascribe-login-header">
                    Log in to ascribe...
                </div>

                <LoginForm />
            </div>
        );
    }
});


let LoginForm = React.createClass({
    handleSuccess(){
        let notification = new GlobalNotificationModel('Login successsful', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        /*Taken from http://stackoverflow.com/a/14916411 */
        /*
        We actually have to trick the Browser into showing the "save password" dialog
        as Chrome expects the login page to be reloaded after the login.
        Users on Stack Overflow claim this is a bug in chrome and should be fixed in the future.
        Until then, we redirect the HARD way, but reloading the whole page using window.location
        */
        window.location = '/collection';
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
                        Log in to ascribe
                    </button>}
                spinner={
                    <button className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                    </button>
                    }>
                <Property
                    name='email'
                    label="Email">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="on"
                        name="username"
                        required/>
                </Property>
                <Property
                    name='password'
                    label="Password">
                    <input
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="on"
                        name="password"
                        required/>
                </Property>
                <hr />
                <div className="ascribe-login-text">
                    Not an ascribe user&#63; Sign up...<br/>
                    Forgot my password&#63; Rescue me...
                </div>
            </Form>
        );
    }
});


export default LoginContainer;