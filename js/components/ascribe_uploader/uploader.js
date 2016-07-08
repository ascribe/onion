import React from 'react';

import { AscribeFileHashUploaderFactory, AscribeUploaderFactory } from 'ascribe-react-components/es6/uploader/ascribe_uploader_factory';
import { uploaderCreateBlobParamsShapeSpec } from 'ascribe-react-components/es6/prop_types/uploader_create_blob_params_shape';
import { uploaderRequestKeyParamsShapeSpec } from 'ascribe-react-components/es6/prop_types/uploader_request_key_params_shape';
import ValidationErrors from 'react-utility-belt/es6/uploader/constants/validation_errors';
import uploaderSpecExtender from 'react-utility-belt/es6/uploader/utils/uploader_spec_extender';

import { safeInvoke } from 'js-utility-belt/es6';

import S3Fetcher from '../../fetchers/s3_fetcher';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import { S3_ACCESS_KEY, S3_ACL, S3_BUCKET } from '../../constants/uploader_constants';

import { makeCsrfHeader as createCsrfHeader } from '../../utils/csrf';
import { kbToMb } from '../../utils/file';
import { getLangText } from '../../utils/lang';
import request from '../../utils/request';
import { resolveUrl } from '../../utils/url_resolver';


const { bool, func, number, shape, string } = React.PropTypes;

const Uploader = React.createClass(uploaderSpecExtender({
    displayName: 'Uploader',

    propTypes: {
        // Whether the selected files should be hashed locally before being uploaded
        hashLocally: bool,

        /**
         * Override to control the notification (if any) that is shown when an upload fails.
         *
         * @param  {File}    file        File that errored
         * @param  {string}  errorReason Reason for the error
         * @param  {Xhr|Xdr} xhr         The xhr used to make the request
         */
        showErrorNotification: func,

        // AscribeBlobUploader props
        // Extend the base createBlobParamsShape with piece details
        // eslint-disable-next-line react/sort-prop-types
        createBlobParams: shape({
            ...uploaderCreateBlobParamsShapeSpec,
            body: shape({
                'piece_id': number
            }).isRequired
        }).isRequired,

        onCreateBlobError: func,
        onCreateBlobSuccess: func,

        // AscribeRequestKeyUploader props
        // Extend the base requestKeyParamsShape with category and piece details
        // eslint-disable-next-line react/sort-prop-types
        requestKeyParams: shape({
            ...uploaderRequestKeyParamsShapeSpec,
            body: shape({
                'category': string.isRequired,
                'piece_id': number,
            }).isRequired
        }).isRequired,

        onRequestKeyError: func,
        onRequestKeySuccess: func,

        // All other props are passed through to AscribeUploader
    },

    getDefaultProps() {
        return {
            onCreateBlobError: (err, file) => this.onError(file, err && err.message),
            onCreateBlobSuccess: this.defaultOnCreateBlobSuccess,
            onDeleteOnlineFile: this.defaultOnDeleteOnlineFile,
            onRequestKeyError: (err, file) => this.onError(file, err && err.message),
            onRequestKeySuccess: this.defaultOnRequestKeySuccess,
            onSessionRequestComplete: this.defaultOnSessionRequestComplete,
            showErrorNotification: (file, errorReason) => {
                const message = errorReason || getLangText('Oops, we had a problem uploading ' +
                                                           'your file. Please contact us if this ' +
                                                           'happens repeatedly.');

                const notification = new GlobalNotificationModel(message, 'danger', 5000);
                GlobalNotificationActions.appendGlobalNotification(notification);
            }
        };
    },

    componentWillMount() {
        // Create uploaders based on current app settings
        // Let's assume that these settings won't change without forcing a remounting of this
        // component.
        const [AscribeUploader, AscribeFileHashUploader] = [
            AscribeUploaderFactory, AscribeFileHashUploaderFactory
        ].map((factory) => factory({
            createCsrfHeader,
            // Note that our request module already includes the CSRF token on every call, so we
            // don't have to add it to the blob and request key headers ourselves
            request,
            S3_ACCESS_KEY,
            S3_ACL,
            S3_BUCKET,
            Urls: {
                S3_DELETE: resolveUrl('s3_delete_file'),
                S3_SIGNATUURE: resolveUrl('s3_signature')
            }
        }));

        // Cache uploaders on this component
        this.AscribeUploader = AscribeUploader;
        this.AscribeFileHashUploader = AscribeFileHashUploader;
    },

    getXhrErrorComment(xhr) {
        return xhr && {
            response: xhr.response,
            url: xhr.responseURL,
            status: xhr.status,
            statusText: xhr.statusText
        };
    },

    /** DEFAULT EVENT HANDLERS (CAN BE OVERRIDDEN COMPLETELY THROUGH PROPS) **/
    defaultOnCreateBlobSuccess(res, file) {
        // `res` should contain one of these file types as a property
        const fileType = res.otherdata || res.digitalwork || res.contractblob || res.thumbnail;

        if (!fileType) {
            const errorMsg = getLangText(
                'Could not find a s3 url as the download location of the file: %s',
                file.name
            );

            throw new Error(errorMsg);
        }

        const changeSet = { $set: fileType.url_safe };
        return {
            s3Url: changeSet,
            s3UrlSafe: changeSet
        };
    },

    defaultOnDeleteOnlineFile(file) {
        return S3Fetcher.deleteFile(file.s3Key, file.s3Bucket);
    },

    defaultOnRequestKeySuccess(res) {
        return res.key;
    },

    defaultOnSessionRequestComplete(response, success) {
        if (!success) {
            return undefined;
        }

        response.forEach((file) => {
            file.url = file.s3UrlSafe;
        });

        return response;
    },

    /** EXTENDED EVENT HANDLERS (ADDS ADDITIONAL BEHAVIOUR TO CALLBACK) **/
    onCanceled(file, ...args) {
        const notification = new GlobalNotificationModel(
            getLangText('Upload of "%s" cancelled', file.name),
            'success',
            5000
        );
        GlobalNotificationActions.appendGlobalNotification(notification);

        safeInvoke(this.props.onCanceled, file, ...args);
    },

    onDeleteComplete(file, xhr, isError, ...args) {
        const notificationTemplate = isError ? 'There was an error deleting "${name}"'
                                             : '"${name}" deleted';

        const notification = new GlobalNotificationModel(
            getLangText(notificationTemplate, file),
            isError ? 'danger' : 'success',
            5000
        );

        GlobalNotificationActions.appendGlobalNotification(notification);

        safeInvoke(this.props.onDeleteComplete, file, xhr, isError, ...args);
    },

    onError(file, errorReason, xhr, ...args) {
        const { onError, showErrorNotification } = this.props;
        const { uploader } = this.refs;

        console.logGlobal(errorReason, {
            files: uploader.getFiles(),
            chunks: uploader.getChunks(),
            xhr: this.getXhrErrorComment(xhr)
        });

        safeInvoke(showErrorNotification, file, errorReason, xhr, ...args);
        safeInvoke(onError, file, errorReason, xhr, ...args);
    },

    onFileHashError(error, ...args) {
        let notification;

        if (error && error.message && error.message.toLowerCase().includes('cancel')) {
            notification = new GlobalNotificationModel(error.message, 'success', 5000);
        } else {
            notification = new GlobalNotificationModel(
                'Failed to hash files. Please contact us if this problem persists.',
                'danger',
                5000
            );
        }

        GlobalNotificationActions.appendGlobalNotification(notification);

        const {
            invoked,
            result: errorResult
        } = safeInvoke(this.props.onFileHashError, error, ...args);

        // If `onFileHashError` doesn't throw its own error or isn't invoked, rethrow the original
        // error back to the uploader
        if (invoked) {
            return errorResult;
        } else {
            throw error;
        }
    },

    onValidationError(errors, validFiles, ...args) {
        const numFileLimitErrors = errors
            .filter((error) => error.validationError.type === ValidationErrors.FILE_LIMIT)
            .length;

        if (numFileLimitErrors === errors.length) {
            // Validation failed because number of files submitted was over the limit
            const { limit, remaining } = errors[0].validationError.description;
            let notification;

            // If we are currently under the limit, just select as many files from the files as
            // possible
            if (remaining) {
                const firstSubmittedFiles = errors
                    .slice(0, remaining)
                    .map((error) => error.file);

                validFiles.push(...firstSubmittedFiles);

                notification = new GlobalNotificationModel(
                    getLangText(
                        'Only %s were allowed (took first %s)',
                        `${remaining} ${getLangText(remaining === 1 ? 'file' : 'files')}`,
                        remaining
                    ),
                    'danger',
                    10000
                );
            } else {
                notification = new GlobalNotificationModel(
                    getLangText(
                        "Oops, you've already uploaded the maximum number of items (%s)!",
                        limit
                    ),
                    'danger',
                    10000
                );
            }

            GlobalNotificationActions.appendGlobalNotification(notification);
        } else {
            // Validation failed because of only some items; ignore those and notify the user
            // If a lot of submitted files fail validation, this might be spammy
            errors
                .map(({ file, validationError: { description, type } }) => {
                    switch (type) {
                        case ValidationErrors.SIZE:
                            // eslint-disable-next-line max-len
                            return getLangText('Cancelled upload of "${name}" as it was bigger than ${size}MB', {
                                name: file.name,
                                size: kbToMb(description.limit)
                            });
                        case ValidationErrors.EXTENSION:
                            return getLangText(
                                // eslint-disable-next-line max-len
                                'Cancelled upload of "${name}" as it has an invalid file format (valid formats: ${allowedExt})', {
                                    allowedExt: description.allowedExtensions.join(', '),
                                    name: file.name
                                }
                            );
                        default:
                            return getLangText(
                                'Cancelled upload of "${name}" as it failed file validation',
                                file
                            );
                    }
                })
                .forEach((errorMsg) => {
                    const notification = new GlobalNotificationModel(errorMsg, 'danger', 5000);
                    GlobalNotificationActions.appendGlobalNotification(notification);
                });
        }

        const {
            invoked,
            result
        } = safeInvoke(this.props.onValidationError, errors, validFiles, ...args);

        return invoked ? result : validFiles;
    },

    render() {
        const { AscribeUploader, AscribeFileHashUploader } = this;
        const { hashLocally, ...props } = this.props;

        const uploaderProps = {
            ...props,
            onCanceled: this.onCanceled,
            onDeleteComplete: this.onDeleteComplete,
            onError: this.onError,
            onValidationError: this.onValidationError,

            // Mandatory for uploaderSpecExtender
            ref: 'uploader'
        };

        return hashLocally ? (
            <AscribeFileHashUploader
                {...uploaderProps}
                onFileHashError={this.onFileHashError} />
        ) : (<AscribeUploader {...uploaderProps} />);
    }
}));

export default Uploader;
