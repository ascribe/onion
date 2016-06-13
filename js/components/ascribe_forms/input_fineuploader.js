'use strict';

import React from 'react';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';
import FileDragAndDrop from '../ascribe_uploader/ascribe_file_drag_and_drop/file_drag_and_drop';

import AppConstants from '../../constants/application_constants';

import { getCookie } from '../../utils/fetch_api';


const { func, bool, oneOf } = React.PropTypes;

const InputFineUploader = React.createClass({
    propTypes: {
        // isFineUploaderActive is used to lock react fine uploader in case
        // a user is actually not logged in already to prevent him from droping files
        // before login in
        isFineUploaderActive: bool,

        // provided by Property
        disabled: bool,
        onChange: func,

        // Props for ReactS3FineUploader
        areAssetsDownloadable: bool,
        createBlobRoutine: ReactS3FineUploader.propTypes.createBlobRoutine,
        enableLocalHashing: bool,
        fileClassToUpload: ReactS3FineUploader.propTypes.fileClassToUpload,
        fileInputElement: ReactS3FineUploader.propTypes.fileInputElement,
        isReadyForFormSubmission: func,
        keyRoutine: ReactS3FineUploader.propTypes.keyRoutine,
        handleChangedFile: func, // TODO: rename to onChangedFile
        submitFile: func, // TODO: rename to onSubmitFile
        onValidationFailed: func,
        setIsUploadReady: func,     //TODO: rename to setIsUploaderValidated
        setWarning: func,
        showErrorPrompt: bool,
        uploadMethod: oneOf(['hash', 'upload']),
        validation: ReactS3FineUploader.propTypes.validation,
    },

    getDefaultProps() {
        return {
            fileInputElement: FileDragAndDrop
        };
    },

    getInitialState() {
        return {
            value: null,
            file: null
        };
    },

    submitFile(file) {
        this.setState({
            file,
            value: file.key
        });

        if (this.state.value && typeof this.props.onChange === 'function') {
            this.props.onChange({ target: { value: this.state.value } });
        }

        if (typeof this.props.submitFile === 'function') {
            this.props.submitFile(file);
        }
    },

    reset() {
        this.refs.fineuploader.reset();
    },

    createBlobRoutine() {
        const { fineuploader } = this.refs;
        const { file } = this.state;

        fineuploader.createBlob(file);
    },

    render() {
        const { areAssetsDownloadable,
                createBlobRoutine,
                enableLocalHashing,
                disabled,
                fileClassToUpload,
                fileInputElement,
                handleChangedFile,
                isFineUploaderActive,
                isReadyForFormSubmission,
                keyRoutine,
                onValidationFailed,
                setIsUploadReady,
                setWarning,
                showErrorPrompt,
                uploadMethod,
                validation } = this.props;
        let editable = isFineUploaderActive;

        // if disabled is actually set by property, we want to override
        // isFineUploaderActive
        if (typeof disabled !== 'undefined') {
            editable = !disabled;
        }

        return (
            <ReactS3FineUploader
                ref="fineuploader"
                fileInputElement={fileInputElement}
                keyRoutine={keyRoutine}
                createBlobRoutine={createBlobRoutine}
                validation={validation}
                submitFile={this.submitFile}
                onValidationFailed={onValidationFailed}
                setIsUploadReady={setIsUploadReady}
                isReadyForFormSubmission={isReadyForFormSubmission}
                areAssetsDownloadable={areAssetsDownloadable}
                areAssetsEditable={editable}
                setWarning={setWarning}
                showErrorPrompt={showErrorPrompt}
                signature={{
                    endpoint: `${AppConstants.serverUrl}/s3/signature/`,
                    customHeaders: {
                       'X-CSRFToken': getCookie(AppConstants.csrftoken)
                    }
                }}
                deleteFile={{
                    enabled: true,
                    method: 'DELETE',
                    endpoint: `${AppConstants.serverUrl}/s3/delete`,
                    customHeaders: {
                       'X-CSRFToken': getCookie(AppConstants.csrftoken)
                    }
                }}
                enableLocalHashing={enableLocalHashing}
                uploadMethod={uploadMethod}
                fileClassToUpload={fileClassToUpload}
                handleChangedFile={handleChangedFile} />
        );
    }
});

export default InputFineUploader;
