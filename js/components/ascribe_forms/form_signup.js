'use strict';

import React from 'react';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import UserActions from '../../actions/user_actions';

import Form from './form';
import Property from './property';
import InputCheckbox from './input_checkbox';

import AscribeSpinner from '../ascribe_spinner';
import withContext from '../context/with_context';
import { locationShape } from '../prop_types';

import ApiUrls from '../../constants/api_urls';

import { getLangText } from '../../utils/lang';


let SignupForm = React.createClass({
    propTypes: {
        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element,
            React.PropTypes.string
        ]),
        whitelabelName: React.PropTypes.string,

        // Injected through HOCs
        isLoggedIn: locationShape.isRequired, // eslint-disable-line react/sort-prop-types
    },

    getDefaultProps() {
        return {
            headerMessage: getLangText('Welcome to ascribe'),
            submitMessage: getLangText('Sign up')
        };
    },

    handleSuccess(response) {
        if (response.user) {
            const notification = new GlobalNotificationModel(getLangText('Sign up successful'), 'success', 50000);
            GlobalNotificationActions.appendGlobalNotification(notification);

            // Refactor this to its own component
            this.props.handleSuccess(getLangText('We sent an email to your address') + ' ' + response.user.email + ', ' + getLangText('please confirm') + '.');
        } else {
            UserActions.fetchCurrentUser(true);
        }
    },

    getFormData() {
        const { token } = this.props.location.query;
        return token ? { token } : null;
    },

    render() {
        const { children,
                headerMessage,
                location: { query: { email: emailQuery } },
                submitMessage,
                whitelabelName } = this.props;

        return (
            <Form
                className="ascribe-form-bordered"
                ref='form'
                url={ApiUrls.users_signup}
                getFormData={this.getFormData}
                handleSuccess={this.handleSuccess}
                buttons={
                    <button type="submit" className="btn btn-default btn-wide">
                        {submitMessage}
                    </button>
                }
                spinner={
                    <span className="btn btn-default btn-wide btn-spinner">
                        <AscribeSpinner color="dark-blue" size="md" />
                    </span>
                }>
                <div className="ascribe-form-header">
                    <h3>{whitelabelName ? `Welcome to ${whitelabelName}` : headerMessage}</h3>
                </div>
                <Property
                    name='email'
                    label={getLangText('Email')}>
                    <input
                        type="email"
                        placeholder={getLangText('(e.g. andy@warhol.co.uk)')}
                        autoComplete="on"
                        defaultValue={emailQuery}
                        required/>
                </Property>
                <Property
                    name='password'
                    label={getLangText('Password')}>
                    <input
                        type="password"
                        placeholder={getLangText('Use a combination of minimum 10 characters and numbers')}
                        autoComplete="on"
                        required/>
                </Property>
                <Property
                    name='password_confirm'
                    label={getLangText('Confirm Password')}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password once again')}
                        autoComplete="on"
                        required/>
                </Property>
                {children}
                <Property
                    name="terms"
                    className="ascribe-property-collapsible-toggle">
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


export default withContext(SignupForm, 'location');
