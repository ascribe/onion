'use strict';

import React from 'react';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

import Form from './form';
import Property from './property';
import FormPropertyHeader from './form_property_header';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';

import AppConstants from '../../constants/application_constants';
import apiUrls from '../../constants/api_urls';

import { getCookie } from '../../utils/fetch_api_utils';
import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';


let RegisterPieceForm = React.createClass({
    propTypes: {
        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        isFineUploaderActive: React.PropTypes.bool,
        enableLocalHashing: React.PropTypes.bool,
        children: React.PropTypes.element,
        onLoggedOut: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            headerMessage: getLangText('Register your work'),
            submitMessage: getLangText('Register work'),
            enableLocalHashing: true
        };
    },

    getInitialState(){
        return mergeOptions(
            {
                digitalWorkKey: null,
                isUploadReady: false
            },
            UserStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
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
        let currentUser = this.state.currentUser;
        let enableLocalHashing = currentUser && currentUser.profile ? currentUser.profile.hash_locally : false;
        enableLocalHashing = enableLocalHashing && this.props.enableLocalHashing;
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
                    ignoreFocus={true}>
                    <FileUploader
                        submitKey={this.submitKey}
                        setIsUploadReady={this.setIsUploadReady}
                        isReadyForFormSubmission={this.isReadyForFormSubmission}
                        isFineUploaderActive={this.props.isFineUploaderActive}
                        onLoggedOut={this.props.onLoggedOut}
                        editable={this.props.isFineUploaderEditable}
                        enableLocalHashing={enableLocalHashing}/>
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

        // isFineUploaderActive is used to lock react fine uploader in case
        // a user is actually not logged in already to prevent him from droping files
        // before login in
        isFineUploaderActive: React.PropTypes.bool,
        onLoggedOut: React.PropTypes.func,
        editable: React.PropTypes.bool,
        enableLocalHashing: React.PropTypes.bool
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
                areAssetsEditable={this.props.isFineUploaderActive}
                signature={{
                    endpoint: AppConstants.serverUrl + 's3/signature/',
                    customHeaders: {
                       'X-CSRFToken': getCookie(AppConstants.csrftoken)
                    }
                }}
                deleteFile={{
                    enabled: true,
                    method: 'DELETE',
                    endpoint: AppConstants.serverUrl + 's3/delete',
                    customHeaders: {
                       'X-CSRFToken': getCookie(AppConstants.csrftoken)
                    }
                }}
                onInactive={this.props.onLoggedOut}
                enableLocalHashing={this.props.enableLocalHashing} />
        );
    }
});

export default RegisterPieceForm;
