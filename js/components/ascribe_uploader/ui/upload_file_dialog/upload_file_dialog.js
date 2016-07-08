import React from 'react';
import update from 'react-addons-update';

import UploadDragAndDropArea from 'react-utility-belt/es6/uploader/upload_drag_and_drop_area';
import uploaderSpecExtender from 'react-utility-belt/es6/uploader/utils/uploader_spec_extender';

import ErrorQueueStore from '../../../../stores/error_queue_store';

import UploadFileDialogUI from './upload_file_dialog_ui';

import Uploader from '../../uploader';

import { ErrorClasses, testErrorAgainstAll } from '../../../../constants/error_constants';
import { UploadMethods, RETRY_ATTEMPT_TO_SHOW_CONTACT_US } from '../../../../constants/uploader_constants';

import { safeInvoke } from '../../../../utils/general';
import { getCurrentQueryParams } from '../../../../utils/url';


const { bool, func, object, oneOf, shape, string } = React.PropTypes;

const UploadFileDialog = React.createClass(uploaderSpecExtender({
    propTypes: {
        /**
         * Upload method to use. Defaults to normal uploading of files as-received.
         *
         * If UploadMethods.USE_URL_PARAM is set, check the current url's upload_method parameter to
         * determine the upload method. For example, `https://www.ascribe.io/app/register_work?upload_method=hash`
         * will use file hashing before uploading.
         */
        uploadMethod: oneOf([
            UploadMethods.HASH,
            UploadMethods.NORMAL,
            UploadMethods.USE_URL_PARAM
        ]).isRequired,

        /**
         * In the case that this dialog is used to load uploaded files from a previous session, it
         * can sometimes be useful to disallow the ability to download or edit (ie. delete) those
         * files.
         */
        areAssetsDownloadable: bool,
        areAssetsEditable: bool,

        className: string,
        disabled: bool,
        fileTypeNames: shape({
            plural: string.isRequired,
            singular: string.isRequired
        }),

        // For Uploadify (and UploadDragAndDropArea)
        // eslint-disable-next-line react/sort-prop-types
        uploaderProps: object.isRequired,

        uploaderType: func

        // Note that any drag event callbacks specified through the props will be properly attached
        // to their events by UploadDragAndDropArea.
    },

    getDefaultProps() {
        return {
            areAssetsDownloadable: true,
            areAssetsEditable: true,
            fileTypeNames: {
                plural: 'files',
                singular: 'file'
            },
            uploadMethod: UploadMethods.NORMAL,
            uploaderType: Uploader
        };
    },

    getInitialState() {
        return {
            errorClass: null,
            hashingFiles: [],
            manualRetryAttempt: 0,
            thumbnailMapping: {},
            uploadInProgress: false
        };
    },

    getUploadErrorClass({ type = 'upload', reason, xhr }) {
        const { manualRetryAttempt } = this.state;
        let matchedErrorClass;

        if ('onLine' in window.navigator && !window.navigator.onLine) {
            // If the user's offline, this is definitely the most important error to show.
            // TODO: use a better mechanism for checking network state, ie. offline.js
            matchedErrorClass = ErrorClasses.upload.offline;
        } else if (manualRetryAttempt === RETRY_ATTEMPT_TO_SHOW_CONTACT_US) {
            // Use the contact us error class if they've retried a number of times
            // and are still unsuccessful
            matchedErrorClass = ErrorClasses.upload.contactUs;
        } else {
            matchedErrorClass = testErrorAgainstAll({ type, reason, xhr });

            if (!matchedErrorClass) {
                // If none found, show the next error message in the queue for upload errors
                matchedErrorClass = ErrorQueueStore.getNextError('upload');
            }
        }

        return matchedErrorClass;
    },

    setThumbnailForFile(file, thumbnailUrl) {
        if ('id' in file) {
            this.setState({
                thumbnailMapping: update(this.state.thumbnailMapping, {
                    [file.id]: { $set: thumbnailUrl }
                })
            });
        } else {
            console.logGlobal(
                new Error('Attempt to set the thumbnail of a file without an id'),
                { file, thumbnailUrl }
            );
        }
    },

    // Override Uploader's showErrorNotification to always show its generic message since we are
    // already displaying the error in this dialog
    showErrorNotification() {
        Uploader.showErrorNotification();
    },

    onAllComplete(...args) {
        this.setState({ uploadInProgress: false });

        safeInvoke(this.props.uploaderProps.onAllComplete, ...args);
    },

    onError(file, errorReason, xhr, ...args) {
        // If we've already found an error, just ignore other errors that pop up. They'll likely
        // pop up again when the user retries.
        if (!this.state.errorClass) {
            this.setState({
                errorClass: this.getUploadErrorClass({
                    reason: errorReason,
                    xhr
                })
            });
        }

        safeInvoke(this.props.uploaderProps.onError, file, errorReason, xhr, ...args);
    },

    onFileHashError(error, ...args) {
        // Clear our tracked hashing files since they've failed
        this.setState({
            hashingFiles: []
        });

        const { onFileHashError } = this.props.uploaderProps;
        const { invoked, result } = safeInvoke(onFileHashError, error, ...args);

        if (invoked) {
            return result;
        } else {
            // Just rethrow the error if no other onFileHashError was specified
            throw error;
        }
    },

    onFileHashProgress(file, hashId, progress, ...args) {
        const { hashingFiles } = this.state;

        // Note that if we've previously cleared our tracked hashing files before (because they've
        // previously succeeded or failed), the hashIds won't start from 0 to fill up the array from
        // the start. This is OK since Javascript's arrays are sparse, and the usual array
        // operations (besides basic `for` loop) will skip any holes.
        let updatedHashingFiles;
        if (hashingFiles[hashId]) {
            updatedHashingFiles = update(hashingFiles, {
                [hashId]: {
                    progress: { $set: progress }
                }
            });
        } else {
            updatedHashingFiles = update(hashingFiles, {
                [hashId]: {
                    $set: { file, progress }
                }
            });
        }

        this.setState({
            hashingFiles: updatedHashingFiles
        });

        const { onFileHashProgress } = this.props.uploaderProps;
        const { invoked, result } = safeInvoke(onFileHashProgress, file, hashId, progress, ...args);

        return invoked ? result : undefined;
    },

    onFileHashSuccess(files, ...args) {
        // Clear our tracked hashing files since they've succeeded
        this.setState({
            hashingFiles: []
        });

        const { onFileHashSuccess } = this.props.uploaderProps;
        const { invoked, result } = safeInvoke(onFileHashSuccess, files, ...args);

        return invoked ? result : files;
    },

    onManualRetry(...args) {
        this.setState({
            manualRetryAttempt: this.state.manualRetryAttempt + 1
        });

        safeInvoke(this.props.uploaderProps.onManualRetry, ...args);
    },

    onUpload(...args) {
        if (!this.state.uploadInProgress) {
            this.setState({ uploadInProgress: true });
        }

        safeInvoke(this.props.uploaderProps.onUpload, ...args);
    },

    render() {
        const {
            areAssetsEditable,
            className,
            disabled: isDisabled,
            uploaderProps,
            uploadMethod: method,
            ...restProps
        } = this.props;
        const { uploadInProgress, errorClass } = this.state;

        const uploadMethod = method === UploadMethods.USE_URL_PARAM
            // If `upload_method` isn't in the current query parameters, tell the UI that we want
            // it to control which method gets used by setting the url parameter
            ? getCurrentQueryParams().uploadMethod || UploadMethods.USE_URL_PARAM
            : method;

        const disabled = isDisabled || uploadInProgress || errorClass || !uploadMethod;

        const props = {
            ...restProps,

            className,
            uploadMethod,
            areAssetsEditable: !isDisabled && areAssetsEditable,

            // Only show the error state once all files are finished
            showError: !uploadInProgress && errorClass,

            uploaderProps: {
                ...uploaderProps,
                hashLocally: uploadMethod === UploadMethods.HASH,
                onAllComplete: this.onAllComplete,
                onError: this.onError,
                onFileHashError: this.onFileHashError,
                onFileHashProgress: this.onFileHashProgress,
                onFileHashSuccess: this.onFileHashSuccess,
                onManualRetry: this.onManualRetry,
                onUpload: this.onUpload,
                showErrorNotification: this.showErrorNotification
            }
        };

        // All props meant for UploadFileDialogUI will be passed through by
        // UploadDragAndDropArea.
        return (
            <UploadDragAndDropArea ref="uploader" {...props} disabled={disabled}>
                <UploadFileDialogUI {...this.state} />
            </UploadDragAndDropArea>
        );
    }
}));

export default UploadFileDialog;
