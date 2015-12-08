'use strict';

import React from 'react';

import Property from './../ascribe_forms/property';

import ReactS3FineUploader from './../ascribe_uploader/react_s3_fine_uploader';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

import { getCookie } from '../../utils/fetch_api_utils';
import { getLangText } from '../../utils/lang_utils';


const { func, bool, number, object, string, arrayOf } = React.PropTypes;

let FurtherDetailsFileuploader = React.createClass({
    propTypes: {
        label: string,
        pieceId: number,
        otherData: arrayOf(object),
        editable: bool,

        // Props for ReactS3FineUploader
        multiple: bool,
        showErrorPrompt: bool,
        submitFile: func, // TODO: rename to onSubmitFile

        setIsUploadReady: func,     //TODO: rename to setIsUploaderValidated
        isReadyForFormSubmission: func
    },

    getDefaultProps() {
        return {
            label: getLangText('Additional files'),
            multiple: false
        };
    },

    render() {
        const {
            editable,
            isReadyForFormSubmission,
            multiple,
            otherData,
            pieceId,
            setIsUploadReady,
            showErrorPrompt,
            submitFile } = this.props;

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
                    keyRoutine={{
                        url: AppConstants.serverUrl + 's3/key/',
                        fileClass: 'otherdata',
                        pieceId: pieceId
                    }}
                    createBlobRoutine={{
                        url: ApiUrls.blob_otherdatas,
                        pieceId: pieceId
                    }}
                    validation={AppConstants.fineUploader.validation.additionalData}
                    submitFile={submitFile}
                    setIsUploadReady={setIsUploadReady}
                    isReadyForFormSubmission={isReadyForFormSubmission}
                    session={{
                        endpoint: AppConstants.serverUrl + 'api/blob/otherdatas/fineuploader_session/',
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
                    areAssetsDownloadable={true}
                    areAssetsEditable={editable}
                    multiple={multiple}
                    showErrorPrompt={showErrorPrompt} />
            </Property>
        );
    }
});

export default FurtherDetailsFileuploader;
