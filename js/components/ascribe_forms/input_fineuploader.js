'use strict';

import React from 'react';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';
import FileDragAndDrop from '../ascribe_uploader/ascribe_file_drag_and_drop/file_drag_and_drop';

import AppConstants from '../../constants/application_constants';

import { getCookie } from '../../utils/fetch_api_utils';


const { func, bool, shape, string, number, element, oneOf, oneOfType, arrayOf } = React.PropTypes;

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
        onStatusChange: func,
        onSubmitFile: func,
        onValidationFailed: func,
        setIsUploaderValidated: func,
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

    onSubmitFile(file) {
        this.setState({
            file,
            value: file.key
        });

        if (this.state.value && typeof this.props.onChange === 'function') {
            this.props.onChange({ target: { value: this.state.value } });
        }

        if (typeof this.props.onSubmitFile === 'function') {
            this.props.onSubmitFile(file);
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
                onStatusChange,
                isFineUploaderActive,
                isReadyForFormSubmission,
                keyRoutine,
                onValidationFailed,
                setIsUploaderValidated,
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
                onSubmitFile={this.onSubmitFile}
                onValidationFailed={onValidationFailed}
                setIsUploaderValidated={setIsUploaderValidated}
                isReadyForFormSubmission={isReadyForFormSubmission}
                areAssetsDownloadable={areAssetsDownloadable}
                areAssetsEditable={editable}
                setWarning={setWarning}
                showErrorPrompt={showErrorPrompt}
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
                enableLocalHashing={enableLocalHashing}
                uploadMethod={uploadMethod}
                fileClassToUpload={fileClassToUpload}
                onStatusChange={onStatusChange} />
        );
    }
});

export default InputFineUploader;
