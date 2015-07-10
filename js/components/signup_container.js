'use strict';

import React from 'react';
import Router from 'react-router';

import { mergeOptions } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';

import UserStore from '../stores/user_store';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';
import InputCheckbox from './ascribe_forms/input_checkbox';


import apiUrls from '../constants/api_urls';


let SignupContainer = React.createClass({
    mixins: [Router.Navigation],

    getInitialState() {
        return mergeOptions({
            submitted: false,
            message: null
        }, UserStore.getState());
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
        if(this.state.currentUser && this.state.currentUser.email) {
            this.transitionTo('pieces');
        }
    },

    handleSuccess(message){
        this.setState({
            submitted: true,
            message: message
        });
    },

    render() {
        if (this.state.submitted){
            return (
                <div className="ascribe-login-wrapper">
                    <br/>
                    <div className="ascribe-login-text ascribe-login-header">
                    {this.state.message}
                    </div>
                </div>
            );
        }
        return (
            <div className="ascribe-login-wrapper">
                <br/>
                <div className="ascribe-login-text ascribe-login-header">
                    {getLangText('Welcome to')} ascribe...
                </div>
                <SignupForm handleSuccess={this.handleSuccess}/>
            </div>
        );
    }
});


let SignupForm = React.createClass({
    propTypes: {
        handleSuccess: React.PropTypes.func
    },

    mixins: [Router.Navigation],

    handleSuccess(response){

        let notificationText = getLangText('Sign up successful');
        let notification = new GlobalNotificationModel(notificationText, 'success', 50000);
        GlobalNotificationActions.appendGlobalNotification(notification);
        this.props.handleSuccess(getLangText('We sent an email to your address') + ' ' + response.user.email +
                                 ', ' + getLangText('please confirm') + '.');

    },
    render() {
        let tooltipPassword = getLangText('Your password must be at least 10 characters') + '.\n ' +
            getLangText('This password is securing your digital property like a bank account') + '.\n ' +
            getLangText('Store it in a safe place') + '!';
        return (
            <Form
                ref='form'
                url={apiUrls.users_signup}
                handleSuccess={this.handleSuccess}
                buttons={
                    <button type="submit" className="btn ascribe-btn ascribe-btn-login">
                        {getLangText('Sign up to ascribe')}
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
                        placeholder={getLangText('(e.g. andy@warhol.co.uk)')}
                        autoComplete="on"
                        required/>
                </Property>
                <Property
                    name='password'
                    label={getLangText('Password')}
                    tooltip={tooltipPassword}>
                    <input
                        type="password"
                        placeholder={getLangText('Use a combination of minimum 10 chars and numbers')}
                        autoComplete="on"
                        required/>
                </Property>
                <Property
                    name='password_confirm'
                    label={getLangText('Confirm Password')}
                    tooltip={tooltipPassword}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password once again')}
                        autoComplete="on"
                        required/>
                </Property>
                <Property
                    name='promo_code'
                    label={getLangText('Promocode')}>
                    <input
                        type="text"
                        placeholder={getLangText('Enter a promocode here (Optional)')}/>
                </Property>
                <Property
                    name="terms"
                    className="ascribe-settings-property-collapsible-toggle">
                    <InputCheckbox />
                </Property>
            </Form>
        );
    }
});

export default SignupContainer;