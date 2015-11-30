'use strict';

import React from 'react';
import { History } from 'react-router';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from './form';
import Property from './property';
import InputCheckbox from './input_checkbox';

import ApiUrls from '../../constants/api_urls';
import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils';


let SignupForm = React.createClass({
    propTypes: {
        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        children: React.PropTypes.element,
        location: React.PropTypes.object
    },

    mixins: [History],

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
    },

    handleSuccess(response) {
        if (response.user) {
            let notification = new GlobalNotificationModel(getLangText('Sign up successful'), 'success', 50000);
            GlobalNotificationActions.appendGlobalNotification(notification);
            
            // Refactor this to its own component
            this.props.handleSuccess(getLangText('We sent an email to your address') + ' ' + response.user.email + ', ' + getLangText('please confirm') + '.');
        } else {
            UserActions.fetchCurrentUser(true);
        }
    },

    getFormData() {
        if (this.props.location.query.token){
            return {token: this.props.location.query.token};
        }
        return null;
    },

    render() {
        let tooltipPassword = getLangText('Your password must be at least 10 characters') + '.\n ' +
            getLangText('This password is securing your digital property like a bank account') + '.\n ' +
            getLangText('Store it in a safe place') + '!';

        let email = this.props.location.query.email || null;

        return (
            <Form
                className="ascribe-form-bordered"
                ref='form'
                url={ApiUrls.users_signup}
                getFormData={this.getFormData}
                handleSuccess={this.handleSuccess}
                buttons={
                    <button type="submit" className="btn btn-default btn-wide">
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
                        placeholder={getLangText('(e.g. andy@warhol.co.uk)')}
                        autoComplete="on"
                        defaultValue={email}
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
                    className="ascribe-property-collapsible-toggle"
                    style={{paddingBottom: 0}}>
                    <InputCheckbox>
                        <span>
                            {' ' + getLangText('I agree to the Terms of Service of ascribe') + ' '}
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
