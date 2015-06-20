'use strict';

import React from 'react';
import Router from 'react-router';


import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';
import InputCheckbox from './ascribe_forms/input_checkbox';

import apiUrls from '../constants/api_urls';


let LoginContainer = React.createClass({
    mixins: [Router.Navigation],

    render() {
        return (
            <div className="ascribe-login-wrapper">
                <br/>
                <div className="ascribe-login-text ascribe-login-header">
                    Welcome to ascribe...
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
        let tooltipPassword = 'Your password must be at least 10 characters.\n ' +
            'This password is securing your digital property like a bank account.\n ' +
            'Store it in a safe place!';
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
                    name='username'
                    label="Username">
                    <input
                        type="text"
                        placeholder="Choose a username"
                        autoComplete="on"
                        required/>
                </Property>
                <Property
                    name='password'
                    label="Password"
                    tooltip={tooltipPassword}>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="on"
                        required/>
                </Property>
                <Property
                    name='password_confirm'
                    label="Confirm Password"
                    tooltip={tooltipPassword}>
                    <input
                        type="password"
                        placeholder="Enter your password once again"
                        autoComplete="on"
                        required/>
                </Property>
                <Property
                    name='promo_code'
                    label="Promocode (Optional)">
                    <input
                        type="password"
                        placeholder="Enter a promocode here"/>
                </Property>
                <InputCheckbox
                    ref="terms"
                    required="required"
                    label={
                        <div>
                            I agree to the&nbsp;
                            <a href="/terms" target="_blank"> Terms of Service</a>
                        </div>}/>
                <hr />
                <button type="submit" className="btn ascribe-btn ascribe-btn-login">
                    Sign up to ascribe
                </button>
            </Form>
        );
    }
});

export default LoginContainer;