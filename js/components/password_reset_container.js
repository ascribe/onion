'use strict';

import React from 'react';
import withRouter from 'react-router/es6/withRouter';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';
import ApiUrls from '../constants/api_urls';
import AscribeSpinner from './ascribe_spinner';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';
import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


let PasswordResetContainer = React.createClass({
    propTypes: {
        // Provided from router
        location: React.PropTypes.object
    },

    getInitialState() {
        return { isRequested: false };
    },

    handleRequestSuccess(email) {
        this.setState({ isRequested: !!email });
    },

    render() {
        const { email: emailQuery, token: tokenQuery } = this.props.location.query;
        const { isRequested } = this.state;

        if (emailQuery && tokenQuery) {
            return (
                <PasswordResetForm
                    email={emailQuery}
                    token={tokenQuery} />
            );
        } else if (!isRequested) {
            return (
                <PasswordRequestResetForm handleRequestSuccess={this.handleRequestSuccess} />
            );
        } else {
            return (
                <div className="ascribe-login-text ascribe-login-header">
                    {getLangText('If your email address exists in our database, you will receive a password recovery link in a few minutes.')}
                </div>
            );
        }
    }
});

let PasswordRequestResetForm = React.createClass({
    propTypes: {
        handleRequestSuccess: React.PropTypes.func
    },

    handleSuccess() {
        const notificationText = getLangText('If your email address exists in our database, you will receive a password recovery link in a few minutes.');
        const notification = new GlobalNotificationModel(notificationText, 'success', 50000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.props.handleRequestSuccess(this.refs.form.refs.email.state.value);
    },

    render() {
        setDocumentTitle(getLangText('Reset your password'));

        return (
            <Form
                ref="form"
                className='ascribe-form-wrapper'
                url={ApiUrls.users_password_reset_request}
                handleSuccess={this.handleSuccess}
                buttons={
                    <button
                        type="submit"
                        className="btn btn-default btn-wide">
                        {getLangText('Reset your password')}
                    </button>
                }
                spinner={
                    <span className="btn btn-default btn-wide btn-spinner">
                        <AscribeSpinner color="dark-blue" size="md" />
                    </span>
                }>
                <div className="ascribe-form-header">
                    <h3>{getLangText('Reset your password')}</h3>
                </div>
                <Property
                    name='email'
                    label={getLangText('Email')}>
                    <input
                        type="email"
                        placeholder={getLangText('Enter your email and we\'ll send a link')}
                        name="email"
                        required/>
                </Property>
                <hr />
            </Form>
        );
    }
});

let PasswordResetForm = withRouter(React.createClass({
    propTypes: {
        router: React.PropTypes.object.isRequired,

        email: React.PropTypes.string,
        token: React.PropTypes.string
    },

    getFormData() {
        return {
            email: this.props.email,
            token: this.props.token
        };
    },

    handleSuccess() {
        this.props.router.push('/collection');

        const notification = new GlobalNotificationModel(getLangText('Password successfully updated'), 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        return (
            <Form
                ref="form"
                className='ascribe-form-wrapper'
                url={ApiUrls.users_password_reset}
                handleSuccess={this.handleSuccess}
                getFormData={this.getFormData}
                buttons={
                    <button
                        type="submit"
                        className="btn btn-default btn-wide">
                        {getLangText('Reset your password')}
                    </button>
                }
                spinner={
                    <span className="btn btn-default btn-wide btn-spinner">
                        <AscribeSpinner color="dark-blue" size="md" />
                    </span>
                }>
                <div className="ascribe-form-header">
                    <h3>{getLangText('Reset the password for')} {this.props.email}</h3>
                </div>
                <Property
                    name='password'
                    label={getLangText('Password')}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter a new password')}
                        name="password"
                        required/>
                </Property>
                <Property
                    name='password_confirm'
                    label={getLangText('Confirm password')}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password once again')}
                        name="password"
                        required/>
                </Property>
                <hr />
            </Form>
        );
    }
}));

export default PasswordResetContainer;
