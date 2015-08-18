'use strict';

import React from 'react';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

import Form from './form';
import Property from './property';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import { getCookie } from '../../utils/fetch_api_utils';
import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';
import { isReadyForFormSubmission } from '../ascribe_uploader/react_s3_fine_uploader_utils';


let RegisterPieceForm = React.createClass({
    propTypes: {
        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        isFineUploaderActive: React.PropTypes.bool,
        isFineUploaderEditable: React.PropTypes.bool,
        enableLocalHashing: React.PropTypes.bool,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
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

    render() {
        let currentUser = this.state.currentUser;
        let enableLocalHashing = currentUser && currentUser.profile ? currentUser.profile.hash_locally : false;
        enableLocalHashing = enableLocalHashing && this.props.enableLocalHashing;

        return (
            <Form
                className="ascribe-form-bordered"
                ref='form'
                url={ApiUrls.pieces_list}
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
                <div className="ascribe-form-header">
                    <h3>{this.props.headerMessage}</h3>
                </div>
                <Property
                    name="digital_work_key"
                    ignoreFocus={true}
                    required={true}>
                    <FileUploader
                        submitKey={this.submitKey}
                        isFineUploaderActive={this.props.isFineUploaderActive}
                        onLoggedOut={this.props.onLoggedOut}
                        editable={this.props.isFineUploaderEditable}
                        enableLocalHashing={enableLocalHashing}/>
                </Property>
                <Property
                    name='artist_name'
                    label={getLangText('Artist Name')}
                    required={true}>
                    <input
                        type="text"
                        placeholder="(e.g. Andy Warhol)"
                        required/>
                </Property>
                <Property
                    name='title'
                    label={getLangText('Title')}
                    required={true}>
                    <input
                        type="text"
                        placeholder="(e.g. 32 Campbell's Soup Cans)"
                        required/>
                </Property>
                <Property
                    name='date_created'
                    label={getLangText('Year Created')}
                    required={true}>
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
        submitKey: React.PropTypes.func,
        isReadyForFormSubmission: React.PropTypes.func,
        onClick: React.PropTypes.func,

        // isFineUploaderActive is used to lock react fine uploader in case
        // a user is actually not logged in already to prevent him from droping files
        // before login in
        isFineUploaderActive: React.PropTypes.bool,
        onLoggedOut: React.PropTypes.func,
        editable: React.PropTypes.bool,
        enableLocalHashing: React.PropTypes.bool,

        // is provided by Property
        onChange: React.PropTypes.func
    },

    getInitialState() {
        return {
            value: false
        };
    },

    setIsUploadReady(isReady) {
        this.setState({
            value: isReady
        });

        // Property is listening to this.state.value to determine
        // if the form is ready. As it will access this.state.value directly
        // we need to call onChange after the state submission has been done.
        this.props.onChange({
            target: {
                value: isReady
            }
        });
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
                    url: ApiUrls.blob_digitalworks
                }}
                submitKey={this.props.submitKey}
                validation={{
                    itemLimit: 100000,
                    sizeLimit: '25000000000'
                }}
                setIsUploadReady={this.setIsUploadReady}
                isReadyForFormSubmission={isReadyForFormSubmission}
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
