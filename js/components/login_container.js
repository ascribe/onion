'use strict';

import React from 'react';
import Router from 'react-router';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';

import apiUrls from '../constants/api_urls';


let LoginContainer = React.createClass({
    mixins: [Router.Navigation],

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
    mixins: [Router.Navigation],


    handleSuccess(){
        let notification = new GlobalNotificationModel('Login successsful', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
        this.transitionTo('pieces');

    },
    render() {
        return (
            <Form
                url={apiUrls.users_login}
                handleSuccess={this.handleSuccess}>
                <Property
                    name='email'
                    label="Email">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="on"
                        required/>
                </Property>
                <Property
                    name='password'
                    label="Password">
                    <input
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="on"
                        required/>
                </Property>
                <hr />
                <div className="ascribe-login-text">
                    Not an ascribe user&#63; Sign up...<br/>
                    Forgot my password&#63; Rescue me...
                </div>
                <button type="submit" className="btn ascribe-btn ascribe-btn-login">
                    Log in to ascribe
                </button>
            </Form>
        );
    }
});


export default LoginContainer;