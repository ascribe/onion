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
        children: React.PropTypes.element,
        onLoggedOut: React.PropTypes.func,

        // For this form to work with SlideContainer, we sometimes have to disable it
        disabled: React.PropTypes.bool
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

    render() {
        let currentUser = this.state.currentUser;
        let enableLocalHashing = currentUser && currentUser.profile ? currentUser.profile.hash_locally : false;
        enableLocalHashing = enableLocalHashing && this.props.enableLocalHashing;

        return (
            <Form
                disabled={this.props.disabled}
                className="ascribe-form-bordered"
                ref='form'
                url={ApiUrls.pieces_list}
                handleSuccess={this.props.handleSuccess}
                buttons={
                    <button
                        type="submit"
                        className="btn btn-default btn-wide"
                        disabled={!this.state.isUploadReady || this.props.disabled}>
                        {this.props.submitMessage}
                    </button>
                }
                spinner={
                    <span className="btn btn-default btn-wide btn-spinner">
                        <AscribeSpinner color="dark-blue" size="md" />
                    </span>
                    }>
                <div className="ascribe-form-header">
                    <h3>{this.props.headerMessage}</h3>
                </div>
                <Property
                    name="digital_work_key"
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
                        isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                        isFineUploaderActive={this.props.isFineUploaderActive}
                        onLoggedOut={this.props.onLoggedOut}
                        disabled={!this.props.isFineUploaderEditable}
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
                        min={1}
                        required/>
                </Property>
                {this.props.children}
            </Form>
        );
    }
});

export default RegisterPieceForm;
