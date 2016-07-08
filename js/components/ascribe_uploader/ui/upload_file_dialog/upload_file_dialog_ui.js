import React from 'react';
import classNames from 'classnames';

import { failedFilesFilter, validProgressFilesFilter } from 'react-utility-belt/es6/uploader/utils/file_filters';

import UploadFileDialogErrorHandler from './upload_file_dialog_error_handler';
import UploadFileDialogFileSelector from './upload_file_dialog_file_selector';
import UploadFileDialogHashProgress from './upload_file_dialog_hash_progress';
import UploadFileDialogMethodSelector from './upload_file_dialog_method_selector';
import UploadFileDialogPreviewIterator from './upload_file_dialog_preview_iterator';

import UploadProgressBar from '../upload_progress_bar';

import { UploadMethods } from '../../../../constants/uploader_constants';


const { arrayOf, bool, func, number, object, oneOf, shape, string } = React.PropTypes;

const propTypes = {
    /**
     * Upload method being used by the uploader.
     *
     * If USE_URL_PARAM is used, assume that the upload method is being determined by the url
     * parameters and show a selector that will modify the current url's query parameters to be
     * one of the available methods.
     */
    uploadMethod: oneOf([
        UploadMethods.HASH,
        UploadMethods.NORMAL,
        UploadMethods.USE_URL_PARAM
    ]).isRequired,

    areAssetsDownloadable: bool,
    areAssetsEditable: bool,
    disabled: bool,
    errorClass: object,
    fileTypeNames: shape({
        plural: string.isRequired,
        singular: string.isRequired
    }),
    hashingFiles: arrayOf(shape({
        progress: number.isRequired
    })),
    showError: bool,
    thumbnailMapping: object,

    // Provided by ReactS3FineUploader
    // eslint-disable-next-line react/sort-prop-types
    uploaderFiles: arrayOf(object).isRequired,
    multiple: bool

    // All other props are passed through to the child components
};

const contextTypes = {
    handleCancelFile: func.isRequired,
    handleCancelHashing: func.isRequired,
    handleDeleteFile: func.isRequired,
    handlePauseFile: func.isRequired,
    handleResumeFile: func.isRequired,
    handleRetryFile: func.isRequired,
    handleSelectFiles: func.isRequired
};

const UploadFileDialogUI = ({
    areAssetsDownloadable,
    areAssetsEditable,
    disabled,
    errorClass,
    hashingFiles,
    multiple,
    showError,
    thumbnailMapping,
    uploaderFiles,
    uploadMethod,
    ...props
}, {
    handleCancelFile,
    handleCancelHashing,
    handleDeleteFile,
    handlePauseFile,
    handleResumeFile,
    handleRetryFile,
    handleSelectFiles
}) => {
    let uploaderUI;
    if (uploadMethod === UploadMethods.USE_URL_PARAMS) {
        // Show upload method selector that will change the current url's query parameters
        uploaderUI = (
            <UploadFileDialogMethodSelector uploadMethod={UploadMethods.USE_URL_PARAMS} />
        );
    } else if (Array.isArray(hashingFiles) && hashingFiles.length) {
        uploaderUI = (
            <UploadFileDialogHashProgress
                handleCancelHashing={handleCancelHashing}
                hashingFiles={hashingFiles} />
        );
    } else {
        const failedFiles = uploaderFiles.filter(failedFilesFilter);
        const validFiles = uploaderFiles.filter(validProgressFilesFilter);

        if (errorClass && showError && failedFiles.length) {
            uploaderUI = (
                <UploadFileDialogErrorHandler
                    errorClass={errorClass}
                    failedFiles={failedFiles}
                    handleRetryFile={handleRetryFile} />
            );
        } else if (validFiles.length) {
            uploaderUI = [(
                <UploadFileDialogPreviewIterator
                    key="upload-file-preview-iterator"
                    downloadable={areAssetsDownloadable}
                    files={validFiles}
                    handleCancelFile={handleCancelFile}
                    handleDeleteFile={handleDeleteFile}
                    handlePauseFile={handlePauseFile}
                    handleResumeFile={handleResumeFile}
                    removable={areAssetsEditable}
                    thumbnailMapping={thumbnailMapping} />
            ), (
                <UploadProgressBar
                    key="upload-progress"
                    className="file-drag-and-drop-overall-progress-bar"
                    files={uploaderFiles} />
            )];
        } else {
            uploaderUI = (
                <UploadFileDialogFileSelector
                    handleSelectFiles={handleSelectFiles}
                    uploadMethod={uploadMethod} />
            );
        }
    }

    return (
        <div className={classNames('file-drag-and-drop', { 'inactive-dropzone': disabled })}>
            {uploaderUI}
        </div>
    );
};

UploadFileDialogUI.propTypes = propTypes;
UploadFileDialogUI.contextTypes = contextTypes;

export default UploadFileDialogUI;
