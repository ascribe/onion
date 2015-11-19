'use strict';

import React from 'react';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

import Form from './form';
import Property from './property';
import InputFineUploader from './input_fineuploader';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';
import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';
import { formSubmissionValidation } from '../ascribe_uploader/react_s3_fine_uploader_utils';


let RegisterPieceForm = React.createClass({
    propTypes: {
        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        isFineUploaderActive: React.PropTypes.bool,
        isFineUploaderEditable: React.PropTypes.bool,
        enableLocalHashing: React.PropTypes.bool,
        onLoggedOut: React.PropTypes.func,

        // For this form to work with SlideContainer, we sometimes have to disable it
        disabled: React.PropTypes.bool,
        location: React.PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),

        onSingleTestComplete: React.PropTypes.func,
        onTestsStart: React.PropTypes.func,
        onTestsComplete: React.PropTypes.func
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

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    getUploadTests() {
        return [
            {
                'name': 'Direct to S3',
                'endpoint': 'https://ascribe0.s3.amazonaws.com'
            },
            {
                'name': 'Direct to S3 with large chunking',
                'endpoint': 'https://ascribe0.s3.amazonaws.com',
                'chunkSize': 52428800
            },
            {
                'name': 'Fastly to S3',
                'endpoint': 'http://www.ascribe.io.global.prod.fastly.net'
            },
            {
                'name': 'Fastly to S3 with large chunking',
                'endpoint': 'http://www.ascribe.io.global.prod.fastly.net',
                'chunkSize': 52428800
            }
        ];
    },

    onTestComplete(testInfo) {
        this.props.onSingleTestComplete(testInfo);

        const uploadTests = this.getUploadTests();
        if (testInfo.name === uploadTests[uploadTests.length - 1].name) {
            this.props.onTestsComplete();
        }
    },

    render() {
        let currentUser = this.state.currentUser;
        let enableLocalHashing = currentUser && currentUser.profile ? currentUser.profile.hash_locally : false;
        enableLocalHashing = enableLocalHashing && this.props.enableLocalHashing;

        return (
            <div>
                <div className="ascribe-form-header">
                    <h3>Upload test</h3>
                </div>
                <Property
                    name="digital_work_key"
                    editable={this.props.isFineUploaderEditable}
                    ignoreFocus={true}>
                    <InputFineUploader
                        keyRoutine={{
                            url: AppConstants.serverUrl + 's3/key/',
                            fileClass: 'digitalwork'
                        }}
                        createBlobRoutine={{
                            url: ApiUrls.blob_digitalworks
                        }}
                        validation={AppConstants.fineUploader.validation.registerWork}
                        setIsUploadReady={this.setIsUploadReady}
                        isFineUploaderActive={this.props.isFineUploaderActive}
                        onLoggedOut={this.props.onLoggedOut}

                        uploadTests={this.getUploadTests()}
                        onTestsStart={this.props.onTestsStart}
                        onTestComplete={this.onTestComplete} />
                </Property>
            </div>
        );
    }
});

export default RegisterPieceForm;
