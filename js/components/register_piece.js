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

import ReactS3FineUploader from './ascribe_uploader/react_s3_fine_uploader';

import DatePicker from 'react-datepicker/dist/react-datepicker';

let RegisterPiece = React.createClass( {
    render() {

        return (
            <div className="row ascribe-row">
                <div className="col-md-6">
                    <FileUploader />
                    <br />
                </div>
                <div className="col-md-6">
                    <RegisterPieceForm />
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

let RegisterPieceForm = React.createClass({
    mixins: [Router.Navigation],


    handleSuccess(){
        let notification = new GlobalNotificationModel('Login successsful', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
        this.transitionTo('pieces');

    },
    render() {
        return (
            <Form
                url={apiUrls.pieces_list}
                handleSuccess={this.handleSuccess}
                buttons={
                    <button type="submit" className="btn ascribe-btn ascribe-btn-login">
                        Register your artwork
                    </button>}
                spinner={
                    <button className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                    </button>
                    }>
                <Property
                    name='artist_name'
                    label="Artist Name">
                    <input
                        type="text"
                        placeholder="The name of the creator"
                        required/>
                </Property>
                <Property
                    name='title'
                    label="Artwork title">
                    <input
                        type="text"
                        placeholder="The title of the artwork"
                        required/>
                </Property>
                <Property
                    name='date_created'
                    label="Year Created">
                    <InputDate
                        placeholderText="Year Created (e.g. 2015)" />
                </Property>
                <Property
                    name='num_editions'
                    label="Number of editions">
                    <input
                        type="number"
                        placeholder="Specify the number of unique editions for this artwork"
                        min={1}
                        required/>
                </Property>
                <hr />
            </Form>
        );
    }
});

let InputDate = React.createClass({
    propTypes: {
        placeholderText: React.PropTypes.string
    },

    getInitialState() {
        return {
            value: null,
            value_formatted: null
        };
    },

    handleChange(date) {
        this.setState({
            value: date,
            value_formatted: date.format('YYYY')});
    },

    render: function () {
        return (
            <DatePicker
                key="example2"
                dateFormat="YYYY"
                selected={this.state.value}
                onChange={this.handleChange}
                onBlur={this.props.onBlur}
                placeholderText={this.props.placeholderText}/>
        );
    }
});

export default RegisterPiece;
