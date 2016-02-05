'use strict';

import React from 'react';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';
import InputTextAreaToggable from './ascribe_forms/input_textarea_toggable';

import AscribeSpinner from './ascribe_spinner';

import ApiUrls from '../constants/api_urls';
import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


let CoaVerifyContainer = React.createClass({
    propTypes: {
        // Provided from AscribeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    render() {
        const { message, signature } = this.props.location.query;
        setDocumentTitle(getLangText('Verify your Certificate of Authenticity'));

        return (
            <div className="ascribe-login-wrapper">
                <br />
                <div className="ascribe-login-text ascribe-login-header">
                    {getLangText('Verify your Certificate of Authenticity')}
                </div>

                <CoaVerifyForm
                    message={message}
                    signature={signature}/>
                <br />
                <br />
                {getLangText('ascribe is using the following public key for verification')}:
                <br />
                <pre>
                -----BEGIN PUBLIC KEY-----
                MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDddadqY31kKPFYk8PQA8BWSTbm
                gaGf9KEYBALp2nWAJcwq80qBzGF+gfi0Z+yb4ooeKHl27GnuxZYValE1Z5ZujfeJ
                TgO4li59ZMYiah8oXZp/OysrBwCvWw0PtWd8/D9Nc4PqyOz5gzEh6kFah5VsuAke
                Znu2w7KmeLZ85SmwEQIDAQAB
                -----END PUBLIC KEY-----
                </pre>
            </div>
        );
    }
});


let CoaVerifyForm = React.createClass({
    propTypes: {
        message: React.PropTypes.string,
        signature: React.PropTypes.string
    },

    handleSuccess(response){
        if (response.verdict) {
            const notification = new GlobalNotificationModel(getLangText('Certificate of Authenticity successfully verified'), 'success');
            GlobalNotificationActions.appendGlobalNotification(notification);
        }
    },

    render() {
        const { message, signature } = this.props;

        return (
            <Form
                url={ApiUrls.coa_verify}
                handleSuccess={this.handleSuccess}
                buttons={
                    <button
                        type="submit"
                        className="btn btn-default btn-wide">
                        {getLangText('Verify your Certificate of Authenticity')}
                    </button>
                }
                spinner={
                    <span className="btn btn-default btn-wide btn-spinner">
                        <AscribeSpinner color="dark-blue" size="md" />
                    </span>
                }>
                <Property
                    name='message'
                    label={getLangText('Message')}>
                    <input
                        type="text"
                        placeholder={getLangText('Copy paste the message on the bottom of your Certificate of Authenticity')}
                        autoComplete="on"
                        defaultValue={message}
                        required />
                </Property>
                <Property
                    name='signature'
                    label="Signature"
                    editable={true}
                    overrideForm={true}>
                    <InputTextAreaToggable
                        rows={3}
                        placeholder={getLangText('Copy paste the signature on the bottom of your Certificate of Authenticity')}
                        defaultValue={signature}
                        required />
                </Property>
                <hr />
            </Form>
        );
    }
});


export default CoaVerifyContainer;
