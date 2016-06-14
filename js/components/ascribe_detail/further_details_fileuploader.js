'use strict';

import React from 'react';

import Property from './../ascribe_forms/property';

import ReactS3FineUploader from './../ascribe_uploader/react_s3_fine_uploader';

import AppConstants from '../../constants/application_constants';
import { validationTypes } from '../../constants/uploader_constants';

import { getCookie } from '../../utils/fetch_api';
import { getLangText } from '../../utils/lang';
import { resolveUrl } from '../../utils/url_resolver';


const { func, bool, number, object, string, arrayOf } = React.PropTypes;

let FurtherDetailsFileuploader = React.createClass({
    propTypes: {
        pieceId: number.isRequired,

        editable: bool,
        label: string,
        otherData: arrayOf(object),

        // Props for ReactS3FineUploader
        areAssetsDownloadable: bool,
        isReadyForFormSubmission: func,
        submitFile: func, // TODO: rename to onSubmitFile
        onValidationFailed: func,
        multiple: bool,
        setIsUploadReady: func,     //TODO: rename to setIsUploaderValidated
        showErrorPrompt: bool,
        validation: ReactS3FineUploader.propTypes.validation
    },

    getDefaultProps() {
        return {
            areAssetsDownloadable: true,
            label: getLangText('Additional files'),
            multiple: false,
            validation: validationTypes.additionalData
        };
    },

    render() {
        const { editable,
                isReadyForFormSubmission,
                multiple,
                onValidationFailed,
                otherData,
                pieceId,
                setIsUploadReady,
                showErrorPrompt,
                submitFile,
                validation } = this.props;

        // Essentially there a three cases important to the fileuploader
        //
        // 1. there is no other_data => do not show the fileuploader at all (where otherData is now an array)
        // 2. there is other_data, but user has no edit rights => show fileuploader but without action buttons
        // 3. both other_data and editable are defined or true => show fileuploader with all action buttons
        if (!editable && (!otherData || otherData.length === 0)) {
            return null;
        }

        let otherDataIds = otherData ? otherData.map((data) => data.id).join() : null;

        return (
            <Property
                name="other_data_key"
                label={this.props.label}>
                <ReactS3FineUploader
                    areAssetsDownloadable
                    areAssetsEditable={editable}
                    createBlobRoutine={{
                        url: resolveUrl('blob_otherdatas'),
                        pieceId: pieceId
                    }}
                    deleteFile={{
                        enabled: true,
                        method: 'DELETE',
                        endpoint: `${AppConstants.serverUrl}/s3/delete`,
                        customHeaders: {
                           'X-CSRFToken': getCookie(AppConstants.csrftoken)
                        }
                    }}
                    isReadyForFormSubmission={isReadyForFormSubmission}
                    keyRoutine={{
                        url: `${AppConstants.serverUrl}/s3/key/`,
                        fileClass: 'otherdata',
                        pieceId: pieceId
                    }}
                    multiple={multiple}
                    onValidationFailed={onValidationFailed}
                    setIsUploadReady={setIsUploadReady}
                    session={{
                        endpoint: `${AppConstants.serverUrl}/api/blob/otherdatas/fineuploader_session/`,
                        customHeaders: {
                            'X-CSRFToken': getCookie(AppConstants.csrftoken)
                        },
                        params: {
                            'pk': otherDataIds
                        },
                        cors: {
                            expected: true,
                            sendCredentials: true
                        }
                    }}
                    signature={{
                        endpoint: `${AppConstants.serverUrl}/s3/signature/`,
                        customHeaders: {
                           'X-CSRFToken': getCookie(AppConstants.csrftoken)
                        }
                    }}
                    submitFile={submitFile}
                    showErrorPrompt={showErrorPrompt}
                    validation={validation} />
            </Property>
        );
    }
});

export default FurtherDetailsFileuploader;
