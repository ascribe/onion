'use strict';

import React from 'react';

import AppConstants from '../constants/application_constants';
import fineUploader from 'fineUploader';

import Router from 'react-router';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';

import apiUrls from '../constants/api_urls';

import ReactS3FineUploader from 'ReactS3FineUploader';

let RegisterPiece = React.createClass( {
    render() {

        return (
            <div className="row ascribe-row">
                <div className="col-md-6">
                    <FileUploader />
                </div>
                <div className="col-md-6">
                    <LoginForm />
                </div>
            </div>
        );
    }
});


let FileUploader = React.createClass( {
    render() {

        return (
            <ReactS3FineUploader
                keyRoutine={{
                    url: AppConstants.serverUrl + 's3/key/',
                    fileClass: 'digitalwork'
                }}
                autoUpload={true}
                debug={false}
                objectProperties={{
                    acl: 'public-read',
                    bucket: 'ascribe0'
                }}
                request={{
                    endpoint: 'https://ascribe0.s3.amazonaws.com',
                    accessKey: 'AKIAIVCZJ33WSCBQ3QDA'
                }}
                signature={{
                    endpoint: AppConstants.serverUrl + 's3/signature/'
                }}
                uploadSuccess={{
                    params: {
                        isBrowserPreviewCapable: fineUploader.supportedFeatures.imagePreviews
                    }
                }}
                cors={{
                    expected: true
                }}
                chunking={{
                    enabled: true
                }}
                resume={{
                    enabled: true
                }}
                retry={{
                    enableAuto: false
                }}
                deleteFile={{
                    enabled: true,
                    method: 'DELETE',
                    endpoint: AppConstants.serverUrl + 's3/delete'
                }}
                validation={{
                    itemLimit: 100000,
                    sizeLimit: '25000000000'
                }}
                session={{
                    endpoint: null
                }}
                messages={{
                    unsupportedBrowser: '<h3>Upload is not functional in IE7 as IE7 has no support for CORS!</h3>'
                }}
                formatFileName={(name) => {// fix maybe
                    if (name !== undefined && name.length > 26) {
                        name = name.slice(0, 15) + '...' + name.slice(-15);
                    }
                    return name;
                }}
                multiple={true}/>
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
                handleSuccess={this.handleSuccess}
                buttons={
                    <button type="submit" className="btn ascribe-btn ascribe-btn-login">
                        Log in to ascribe
                    </button>}
                spinner={
                    <button className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                    </button>
                    }>
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
            </Form>
        );
    }
});
export default RegisterPiece;
