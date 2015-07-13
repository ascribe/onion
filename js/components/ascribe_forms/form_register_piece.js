'use strict';

import React from 'react';

import AppConstants from '../../constants/application_constants';

import Form from './form';
import Property from './property';
import FormPropertyHeader from './form_property_header';

import apiUrls from '../../constants/api_urls';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';

import { getCookie } from '../../utils/fetch_api_utils';
import { getLangText } from '../../utils/lang_utils';


let RegisterPieceForm = React.createClass({
    getInitialState(){
        return {
            digitalWorkKey: null,
            isUploadReady: false
        };
    },

    getFormData(){
        return {
            digital_work_key: this.state.digitalWorkKey
        };
    },

    submitKey(key){
        this.setState({
            digitalWorkKey: key
        });
    },

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    isReadyForFormSubmission(files) {
        files = files.filter((file) => file.status !== 'deleted' && file.status !== 'canceled');
        if (files.length > 0 && files[0].status === 'upload successful') {
            return true;
        } else {
            return false;
        }
    },

    render() {
        return (
            <Form
                className="ascribe-form-bordered"
                ref='form'
                url={apiUrls.pieces_list}
                getFormData={this.getFormData}
                handleSuccess={this.props.handleSuccess}
                buttons={<button
                            type="submit"
                            className="btn ascribe-btn ascribe-btn-login"
                            disabled={!this.state.isUploadReady}>
                            {getLangText('Register work')}
                        </button>}
                spinner={
                    <span className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                    </span>
                    }>
                <FormPropertyHeader>
                    <h3>{getLangText('Register your work')}</h3>
                </FormPropertyHeader>
                <Property
                    ignoreFocus={true}>
                    <FileUploader
                        submitKey={this.submitKey}
                        setIsUploadReady={this.setIsUploadReady}
                        isReadyForFormSubmission={this.isReadyForFormSubmission}
                        editable={this.props.isFineUploaderEditable}/>
                </Property>
                <Property
                    name='artist_name'
                    label={getLangText('Artist Name')}>
                    <input
                        type="text"
                        placeholder="(e.g. Andy Warhol)"
                        required/>
                </Property>
                <Property
                    name='title'
                    label={getLangText('Title')}>
                    <input
                        type="text"
                        placeholder="(e.g. 32 Campbell's Soup Cans)"
                        required/>
                </Property>
                <Property
                    name='date_created'
                    label={getLangText('Year Created')}>
                    <input
                        type="number"
                        placeholder="(e.g. 1962)"
                        min={0}
                        required/>
                </Property>
                {this.props.children}
            </Form>
        );
    }
});

let FileUploader = React.createClass({
    propTypes: {
        setIsUploadReady: React.PropTypes.func,
        submitKey: React.PropTypes.func,
        isReadyForFormSubmission: React.PropTypes.func,
        onClick: React.PropTypes.func,
        // editable is used to lock react fine uploader in case
        // a user is actually not logged in already to prevent him from droping files
        // before login in
        editable: React.PropTypes.bool
    },

    render() {
        return (
            <ReactS3FineUploader
                onClick={this.props.onClick}
                keyRoutine={{
                    url: AppConstants.serverUrl + 's3/key/',
                    fileClass: 'digitalwork'
                }}
                createBlobRoutine={{
                    url: apiUrls.blob_digitalworks
                }}
                submitKey={this.props.submitKey}
                validation={{
                    itemLimit: 100000,
                    sizeLimit: '25000000000'
                }}
                setIsUploadReady={this.props.setIsUploadReady}
                isReadyForFormSubmission={this.props.isReadyForFormSubmission}
                areAssetsDownloadable={false}
                areAssetsEditable={this.props.editable}
                signature={{
                    endpoint: AppConstants.serverUrl + 's3/signature/',
                    customHeaders: {
                       'X-CSRFToken': getCookie('csrftoken')
                    }
                }}
                deleteFile={{
                    enabled: true,
                    method: 'DELETE',
                    endpoint: AppConstants.serverUrl + 's3/delete',
                    customHeaders: {
                       'X-CSRFToken': getCookie('csrftoken')
                    }
                }}/>
        );
    }
});

export default RegisterPieceForm;