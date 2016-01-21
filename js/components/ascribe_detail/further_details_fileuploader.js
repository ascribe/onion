'use strict';

import React from 'react';

import Property from './../ascribe_forms/property';

import ReactS3FineUploader from './../ascribe_uploader/react_s3_fine_uploader';

import ApiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';
import { validationTypes } from '../../constants/uploader_constants';

import { getCookie } from '../../utils/fetch_api_utils';
import { getLangText } from '../../utils/lang_utils';


let FurtherDetailsFileuploader = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number.isRequired,

        areAssetsDownloadable: React.PropTypes.bool,
        editable: React.PropTypes.bool,
        isReadyForFormSubmission: React.PropTypes.func,
        label: React.PropTypes.string,
        multiple: React.PropTypes.bool,
        otherData: React.PropTypes.arrayOf(React.PropTypes.object),
        onValidationFailed: React.PropTypes.func,
        setIsUploadReady: React.PropTypes.func,
        submitFile: React.PropTypes.func,
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
                label={this.props.label}>
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
                    validation={this.props.validation}
                    submitFile={this.props.submitFile}
                    onValidationFailed={this.props.onValidationFailed}
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
                    areAssetsDownloadable={this.props.areAssetsDownloadable}
                    areAssetsEditable={this.props.editable}
                    multiple={this.props.multiple} />
            </Property>
        );
    }
});

export default FurtherDetailsFileuploader;
