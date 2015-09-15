'use strict';

import React from 'react';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';
import UploadButton from '../ascribe_uploader/ascribe_upload_button/upload_button';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import { formSubmissionValidation } from '../ascribe_uploader/react_s3_fine_uploader_utils';
import { getCookie } from '../../utils/fetch_api_utils';
import { getLangText } from '../../utils/lang_utils';


let ContractSettingsUpdateButton = React.createClass({

    setIsUploadReady() {
        console.log('upload done');
    },

    submitFile(file) {
        console.log(file);
    },

    render() {
        return (
           <ReactS3FineUploader
                fileInputElement={UploadButton}
                keyRoutine={{
                    url: AppConstants.serverUrl + 's3/key/',
                    fileClass: 'contract'
                }}
                createBlobRoutine={{
                    url: ApiUrls.blob_contracts
                }}
                validation={{
                    itemLimit: 100000,
                    sizeLimit: '50000000',
                    allowedExtensions: ['pdf']
                }}
                setIsUploadReady={this.setIsUploadReady}
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
                fileClassToUpload={{
                    singular: getLangText('UPDATE'),
                    plural: getLangText('UPDATE')
                }}
                isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                submitFile={this.submitFile}
            />
        );
    }
});

export default ContractSettingsUpdateButton;