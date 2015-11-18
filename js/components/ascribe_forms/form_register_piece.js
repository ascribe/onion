'use strict';

import React from 'react';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

import Form from './form';
import Property from './property';
import InputFineUploader from './input_fineuploader';
import UploadButton from '../ascribe_uploader/ascribe_upload_button/upload_button';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';
import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';
import { formSubmissionValidation, displayValidFilesFilter } from '../ascribe_uploader/react_s3_fine_uploader_utils';


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
        ])
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
                digitalWorkKeyReady: false,
                thumbnailKeyReady: true,
                thumbnailKeyDialogExpanded: false
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

    /**
     * This method is overloaded so that we can track the ready-state
     * of each uploader in the component
     * @param {string} uploaderKey Name of the uploader's key to track
     */
    setIsUploadReady(uploaderKey) {
        return (isUploadReady) => {
            this.setState({
                [uploaderKey]: isUploadReady
            });
        };
    },

    handleSelectFiles(files) {
        const validFiles = files.filter(displayValidFilesFilter);

        if(validFiles.length > 0) {
            const { type: fileType } = validFiles[0].type;
            const fileExtension = fileType && fileType.split('/').length ? fileType.split('/')[1]
                                                                         : 'unknown';
            const thumbnailKeyDialogExpanded = AppConstants.supportedThumbnailFileFormats.indexOf(fileExtension) === -1;
            this.setState({ thumbnailKeyDialogExpanded });
        } else {
            this.setState({ thumbnailKeyDialogExpanded: false });
        }
    },

    render() {
        const { disabled,
                handleSuccess,
                submitMessage,
                headerMessage,
                isFineUploaderActive,
                onLoggedOut,
                isFineUploaderEditable,
                location,
                children,
                enableLocalHashing } = this.props;
        const { currentUser,
                digitalWorkKeyReady,
                thumbnailKeyReady,
                thumbnailKeyDialogExpanded } = this.state;

        const profileHashLocally = currentUser && currentUser.profile ? currentUser.profile.hash_locally : false;
        const hashLocally = profileHashLocally && enableLocalHashing;

        return (
            <Form
                disabled={disabled}
                className="ascribe-form-bordered"
                ref='form'
                url={ApiUrls.pieces_list}
                handleSuccess={handleSuccess}
                buttons={
                    <button
                        type="submit"
                        className="btn btn-default btn-wide"
                        disabled={!(digitalWorkKeyReady && thumbnailKeyReady)}>
                        {submitMessage}
                    </button>
                }
                spinner={
                    <span className="btn btn-default btn-wide btn-spinner">
                        <AscribeSpinner color="dark-blue" size="md" />
                    </span>
                    }>
                <div className="ascribe-form-header">
                    <h3>{headerMessage}</h3>
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
                        setIsUploadReady={this.setIsUploadReady('digitalWorkKeyReady')}
                        isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                        isFineUploaderActive={isFineUploaderActive}
                        onLoggedOut={onLoggedOut}
                        disabled={!isFineUploaderEditable}
                        enableLocalHashing={hashLocally}
                        uploadMethod={location.query.method}
                        handleSelectFiles={this.handleSelectFiles}/>
                </Property>
                <Property
                    name="thumbnail_file"
                    expanded={thumbnailKeyDialogExpanded}>
                    <InputFineUploader
                            fileInputElement={UploadButton({ className: 'btn btn-secondary btn-sm' })}
                            createBlobRoutine={{
                                url: ApiUrls.blob_thumbnails
                            }}
                            isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                            keyRoutine={{
                                url: AppConstants.serverUrl + 's3/key/',
                                fileClass: 'thumbnail'
                            }}
                            validation={{
                                itemLimit: AppConstants.fineUploader.validation.registerWork.itemLimit,
                                sizeLimit: AppConstants.fineUploader.validation.additionalData.sizeLimit,
                                allowedExtensions: ['png', 'jpg', 'jpeg', 'gif']
                            }}
                            setIsUploadReady={this.setIsUploadReady('thumbnailKeyReady')}
                            location={location}
                            fileClassToUpload={{
                                singular: getLangText('Select representative image'),
                                plural: getLangText('Select representative images')
                            }}/>
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
                {children}
            </Form>
        );
    }
});

export default RegisterPieceForm;
