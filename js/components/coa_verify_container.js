'use strict';

import React from 'react';
import Router from 'react-router';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';
import InputTextAreaToggable from './ascribe_forms/input_textarea_toggable';

import apiUrls from '../constants/api_urls';
import { getLangText } from '../utils/lang_utils';


let CoaVerifyContainer = React.createClass({
    mixins: [Router.Navigation],

    render() {
        return (
            <div className="ascribe-login-wrapper">
                <br/>
                <div className="ascribe-login-text ascribe-login-header">
                    Verify your Certificate of Authenticity
                </div>

                <CoaVerifyForm />
                <br />
                <br />
                ascribe is using the following public key for verification:
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
    mixins: [Router.Navigation],

    handleSuccess(response){
        let notification = null;
        if (response.verdict){
            notification = new GlobalNotificationModel('Certificate of Authenticity successfully verified', 'success');
            GlobalNotificationActions.appendGlobalNotification(notification);
        }
    },

    render() {
        return (
            <div>
                <Form
                    url={apiUrls.coa_verify}
                    handleSuccess={this.handleSuccess}
                    buttons={
                        <button
                            type="submit"
                            className="btn ascribe-btn ascribe-btn-login">
                            Verify your Certificate of Authenticity
                        </button>}
                    spinner={
                        <button className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                            <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                        </button>
                        }>
                    <Property
                        name='message'
                        label="Message">
                        <input
                            type="text"
                            placeholder="Copy paste the message on the bottom of your Certificate of Authenticity"
                            autoComplete="on"
                            name="username"
                            required/>
                    </Property>
                    <Property
                        name='signature'
                        label="Signature">
                        <InputTextAreaToggable
                            rows={3}
                            editable={true}
                            placeholder="Copy paste the signature on the bottom of your Certificate of Authenticity"
                            required/>
                    </Property>
                    <hr />
                </Form>
            </div>
        );
    }
});


export default CoaVerifyContainer;