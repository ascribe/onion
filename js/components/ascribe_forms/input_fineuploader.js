'use strict';

import React from 'react';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';
import FileDragAndDrop from '../ascribe_uploader/ascribe_file_drag_and_drop/file_drag_and_drop';

import AppConstants from '../../constants/application_constants';

import { getCookie } from '../../utils/fetch_api_utils';


const { func, bool, shape, string, number, arrayOf } = React.PropTypes;

const InputFineUploader = React.createClass({
    propTypes: {
        setIsUploadReady: func,
        isReadyForFormSubmission: func,
        submitFile: func,
        fileInputElement: func,

        areAssetsDownloadable: bool,

        keyRoutine: shape({
            url: string,
            fileClass: string
        }),
        createBlobRoutine: shape({
            url: string
        }),
        validation: shape({
            itemLimit: number,
            sizeLimit: string,
            allowedExtensions: arrayOf(string)
        }),

        // isFineUploaderActive is used to lock react fine uploader in case
        // a user is actually not logged in already to prevent him from droping files
        // before login in
        isFineUploaderActive: bool,
        onLoggedOut: func,

        enableLocalHashing: bool,
        uploadMethod: string,

        // provided by Property
        disabled: bool,

        // A class of a file the user has to upload
        // Needs to be defined both in singular as well as in plural
        fileClassToUpload: shape({
            singular: string,
            plural: string
        }),
        handleChangedFile: func
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

        if(this.state.value && typeof this.props.onChange === 'function') {
            this.props.onChange({ target: { value: this.state.value } });
        }

        if(typeof this.props.submitFile === 'function') {
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
        const { fileInputElement,
                keyRoutine,
                createBlobRoutine,
                validation,
                setIsUploadReady,
                isReadyForFormSubmission,
                areAssetsDownloadable,
                onLoggedOut,
                enableLocalHashing,
                fileClassToUpload,
                uploadMethod,
                handleChangedFile } = this.props;
        let editable = this.props.isFineUploaderActive;

        // if disabled is actually set by property, we want to override
        // isFineUploaderActive
        if(typeof this.props.disabled !== 'undefined') {
            editable = !this.props.disabled;
        }

        return (
            <ReactS3FineUploader
                ref="fineuploader"
                fileInputElement={fileInputElement}
                keyRoutine={keyRoutine}
                createBlobRoutine={createBlobRoutine}
                validation={validation}
                submitFile={this.submitFile}
                setIsUploadReady={setIsUploadReady}
                isReadyForFormSubmission={isReadyForFormSubmission}
                areAssetsDownloadable={areAssetsDownloadable}
                areAssetsEditable={editable}
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
                onInactive={onLoggedOut}
                enableLocalHashing={enableLocalHashing}
                uploadMethod={uploadMethod}
                fileClassToUpload={fileClassToUpload}
                handleChangedFile={handleChangedFile}/>
        );
    }
});

export default InputFineUploader;
