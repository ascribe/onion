'use strict';

import React from 'react';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

import Form from './form';
import Property from './property';
import InputFineUploader from './input_fineuploader';

import FormSubmitButton from '../ascribe_buttons/form_submit_button';

import UploadButton from '../ascribe_uploader/ascribe_upload_button/upload_button';

import AscribeSpinner from '../ascribe_spinner';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';
import { validationParts, validationTypes } from '../../constants/uploader_constants';

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
        enableSeparateThumbnail: React.PropTypes.bool,

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
            enableLocalHashing: true,
            enableSeparateThumbnail: true
        };
    },

    getInitialState(){
        return mergeOptions(
            {
                digitalWorkFile: null
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
            // See documentation of `FormSubmitButton` for more detailed information
            // on this.
            this.refs.submitButton.setReadyStateForKey(uploaderKey, isUploadReady);
        };
    },

    handleChangedDigitalWork(digitalWorkFile) {
        if (digitalWorkFile &&
            (digitalWorkFile.status === 'deleted' || digitalWorkFile.status === 'canceled')) {
            this.refs.form.refs.thumbnail_file.reset();

            // Manually we need to set the ready state for `thumbnailKeyReady` back
            // to `true` as `ReactS3Fineuploader`'s `reset` method triggers
            // `setIsUploadReady` with `false`
            this.refs.submitButton.setReadyStateForKey('thumbnailKeyReady', true);
            this.setState({ digitalWorkFile: null });
        } else {
            this.setState({ digitalWorkFile });
        }
    },

    handleChangedThumbnail(thumbnailFile) {
        const { digitalWorkFile } = this.state;
        const { fineuploader } = this.refs.digitalWorkFineUploader.refs;

        fineuploader.setThumbnailForFileId(
            digitalWorkFile.id,
            // if thumbnail was delete, we delete it from the display as well
            thumbnailFile.status !== 'deleted' ? thumbnailFile.url : null
        );
    },

    handleThumbnailValidationFailed(thumbnailFile) {
        // If the validation fails, set the thumbnail as submittable since its optional
        this.refs.submitButton.setReadyStateForKey('thumbnailKeyReady', true);
    },

    isThumbnailDialogExpanded() {
        const { enableSeparateThumbnail } = this.props;
        const { digitalWorkFile } = this.state;

        if(digitalWorkFile && enableSeparateThumbnail) {
            const { type: mimeType } = digitalWorkFile;
            const mimeSubType = mimeType && mimeType.split('/').length ? mimeType.split('/')[1]
                                                                       : 'unknown';
            return AppConstants.supportedThumbnailFileFormats.indexOf(mimeSubType) === -1;
        } else {
            return false;
        }
    },

    render() {
        const { disabled,
                handleSuccess,
                submitMessage,
                headerMessage,
                isFineUploaderActive,
                isFineUploaderEditable,
                location,
                children,
                enableLocalHashing } = this.props;
        const { currentUser} = this.state;

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
                    <FormSubmitButton
                        ref="submitButton"
                        defaultReadyStates={{
                            digitalWorkKeyReady: false,
                            thumbnailKeyReady: true
                        }}
                        label={submitMessage}/>
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
                    ignoreFocus={true}
                    label={getLangText('Your Work')}>
                    <InputFineUploader
                        ref={ref => this.refs.digitalWorkFineUploader = ref}
                        keyRoutine={{
                            url: AppConstants.serverUrl + 's3/key/',
                            fileClass: 'digitalwork'
                        }}
                        createBlobRoutine={{
                            url: ApiUrls.blob_digitalworks
                        }}
                        validation={validationTypes.registerWork}
                        setIsUploadReady={this.setIsUploadReady('digitalWorkKeyReady')}
                        isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                        isFineUploaderActive={isFineUploaderActive}
                        disabled={!isFineUploaderEditable}
                        enableLocalHashing={hashLocally}
                        uploadMethod={location.query.method}
                        handleChangedFile={this.handleChangedDigitalWork}/>
                </Property>
                <Property
                    name="thumbnail_file"
                    expanded={this.isThumbnailDialogExpanded()}>
                    <InputFineUploader
                        ref={ref => this.refs.thumbnailFineUploader = ref}
                        fileInputElement={UploadButton({ className: 'btn btn-secondary btn-sm' })}
                        createBlobRoutine={{
                            url: ApiUrls.blob_thumbnails
                        }}
                        handleChangedFile={this.handleChangedThumbnail}
                        onValidationFailed={this.handleThumbnailValidationFailed}
                        isReadyForFormSubmission={formSubmissionValidation.fileOptional}
                        keyRoutine={{
                            url: AppConstants.serverUrl + 's3/key/',
                            fileClass: 'thumbnail'
                        }}
                        validation={{
                            itemLimit: validationTypes.workThumbnail.itemLimit,
                            sizeLimit: validationTypes.workThumbnail.sizeLimit,
                            allowedExtensions: validationParts.allowedExtensions.images
                        }}
                        setIsUploadReady={this.setIsUploadReady('thumbnailKeyReady')}
                        fileClassToUpload={{
                            singular: getLangText('Select representative image'),
                            plural: getLangText('Select representative images')
                        }}
                        isFineUploaderActive={isFineUploaderActive}
                        disabled={!isFineUploaderEditable}
                        enableLocalHashing={enableLocalHashing}
                        uploadMethod={location.query.method} />
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
