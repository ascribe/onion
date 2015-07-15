'use strict';

import React from 'react';
import Router from 'react-router';

import { getLangText } from '../../utils/lang_utils';

import UserStore from '../../stores/user_store';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from './form';
import Property from './property';
import FormPropertyHeader from './form_property_header';
import InputCheckbox from './input_checkbox';

import apiUrls from '../../constants/api_urls';


let SignupForm = React.createClass({

    propTypes: {
        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        children: React.PropTypes.element
    },

    mixins: [Router.Navigation],

    getDefaultProps() {
        return {
            headerMessage: getLangText('Welcome to ascribe'),
            submitMessage: getLangText('Sign up')
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
        if(this.state.currentUser && this.state.currentUser.email) {
            this.transitionTo('pieces');
        }
    },

    handleSuccess(response){
        let notification = new GlobalNotificationModel(getLangText('Sign up successful'), 'success', 50000);
        GlobalNotificationActions.appendGlobalNotification(notification);
        this.props.handleSuccess(getLangText('We sent an email to your address') + ' ' + response.user.email + ', ' + getLangText('please confirm') + '.');

    },
    getFormData(){
        return {terms: this.refs.form.refs.terms.refs.input.state.value};
    },
    render() {
        let tooltipPassword = getLangText('Your password must be at least 10 characters') + '.\n ' +
            getLangText('This password is securing your digital property like a bank account') + '.\n ' +
            getLangText('Store it in a safe place') + '!';
        return (
            <Form
                className="ascribe-form-bordered"
                ref='form'
                url={apiUrls.users_signup}
                handleSuccess={this.handleSuccess}
                getFormData={this.getFormData}
                buttons={
                    <button type="submit" className="btn ascribe-btn ascribe-btn-login">
                        {this.props.submitMessage}
                    </button>}
                spinner={
                    <span className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                    </span>
                    }>
                <FormPropertyHeader>
                    <h3>{this.props.headerMessage}</h3>
                </FormPropertyHeader>
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
                {this.props.children}
                <Property
                    name="terms"
                    className="ascribe-settings-property-collapsible-toggle"
                    style={{paddingBottom: 0}}>
                    <InputCheckbox>
                        <span>
                            {' ' + getLangText('I agree to the Terms of Service') + ' '}
                            (<a href="https://www.ascribe.io/terms" target="_blank" style={{fontSize: '0.9em', color: 'rgba(0,0,0,0.7)'}}>
                                {getLangText('read')}
                            </a>)
                        </span>
                    </InputCheckbox>
                </Property>
            </Form>
        );
    }
});


export default SignupForm;
