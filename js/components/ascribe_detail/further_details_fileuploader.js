'use strict';

import React from 'react';

import Property from './../ascribe_forms/property';

import ReactS3FineUploader from './../ascribe_uploader/react_s3_fine_uploader';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

import { getCookie } from '../../utils/fetch_api_utils';

let FurtherDetailsFileuploader = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number,
        otherData: React.PropTypes.arrayOf(React.PropTypes.object),
        setIsUploadReady: React.PropTypes.func,
        submitFile: React.PropTypes.func,
        isReadyForFormSubmission: React.PropTypes.func,
        editable: React.PropTypes.bool,
        multiple: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            multiple: false
        };
    },

    render() {
        // Essentially there a three cases important to the fileuploader
        //
        // 1. there is no other_data => do not show the fileuploader at all (where otherData is now an array)
        // 2. there is other_data, but user has no edit rights => show fileuploader but without action buttons
        // 3. both other_data and editable are defined or true => show fileuploader with all action buttons
        if (!this.props.editable && (!this.props.otherData || this.props.otherData.length === 0)) {
            return null;
        }

        let otherDataIds = this.props.otherData ? this.props.otherData.map((data) => data.id).join() : null;

        return (
            <Property
                name="other_data_key"
                label="Additional files">
                <ReactS3FineUploader
                    keyRoutine={{
                        url: AppConstants.serverUrl + 's3/key/',
                        fileClass: 'otherdata',
                        pieceId: this.props.pieceId
                    }}
                    createBlobRoutine={{
                        url: ApiUrls.blob_otherdatas,
                        pieceId: this.props.pieceId
                    }}
                    validation={AppConstants.fineUploader.validation.additionalData}
                    submitFile={this.props.submitFile}
                    setIsUploadReady={this.props.setIsUploadReady}
                    isReadyForFormSubmission={this.props.isReadyForFormSubmission}
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
                    areAssetsEditable={this.props.editable}
                    multiple={this.props.multiple} />
            </Property>
        );
    }
});

export default FurtherDetailsFileuploader;
