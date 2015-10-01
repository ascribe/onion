'use strict';

import React from 'react';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';
import InputTextAreaToggable from './ascribe_forms/input_textarea_toggable';

import ApiUrls from '../constants/api_urls';
import { getLangText } from '../utils/lang_utils';


let CoaVerifyContainer = React.createClass({
    render() {
        return (
            <div className="ascribe-login-wrapper">
                <br/>
                <div className="ascribe-login-text ascribe-login-header">
                    {getLangText('Verify your Certificate of Authenticity')}
                </div>

                <CoaVerifyForm />
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
    handleSuccess(response){
        let notification = null;
        if (response.verdict) {
            notification = new GlobalNotificationModel(getLangText('Certificate of Authenticity successfully verified'), 'success');
            GlobalNotificationActions.appendGlobalNotification(notification);
        }
    },

    render() {
        return (
            <div>
                <Form
                    url={ApiUrls.coa_verify}
                    handleSuccess={this.handleSuccess}
                    buttons={
                        <button
                            type="submit"
                            className="btn ascribe-btn ascribe-btn-login">
                            {getLangText('Verify your Certificate of Authenticity')}
                        </button>}
                    spinner={
                        <span className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                            <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                        </span>
                        }>
                    <Property
                        name='message'
                        label={getLangText('Message')}>
                        <input
                            type="text"
                            placeholder={getLangText('Copy paste the message on the bottom of your Certificate of Authenticity')}
                            autoComplete="on"
                            name="username"
                            required/>
                    </Property>
                    <Property
                        name='signature'
                        label="Signature"
                        editable={true}
                        overrideForm={true}>
                        <InputTextAreaToggable
                            rows={3}
                            placeholder={getLangText('Copy paste the signature on the bottom of your Certificate of Authenticity')}
                            required/>
                    </Property>
                    <hr />
                </Form>
            </div>
        );
    }
});


export default CoaVerifyContainer;
