'use strict';

import React from 'react';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';
import UploadButton from '../ascribe_uploader/ascribe_upload_button/upload_button';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import ContractListActions from '../../actions/contract_list_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import { formSubmissionValidation } from '../ascribe_uploader/react_s3_fine_uploader_utils';
import { getCookie } from '../../utils/fetch_api_utils';
import { getLangText } from '../../utils/lang_utils';


let ContractSettingsUpdateButton = React.createClass({
    propTypes: {
        contract: React.PropTypes.object
    },

    submitFile(file) {
        let contract = this.props.contract;

        // override the blob with the key's value
        contract.blob = file.key;

        // send it to the server
        ContractListActions
            .changeContract(contract)
            .then((res) => {

                // Display feedback to the user
                let notification = new GlobalNotificationModel(getLangText('Contract %s successfully updated', res.name), 'success', 5000);
                GlobalNotificationActions.appendGlobalNotification(notification);

                // and refresh the contract list to get the updated contracs
                return ContractListActions.fetchContractList(true);
            })
            .then(() => {
                // Also, reset the fineuploader component so that the user can again 'update' his contract
                this.refs.fineuploader.reset();
            })
            .catch((err) => {
                console.logGlobal(err);
                let notification = new GlobalNotificationModel(getLangText('Contract could not be updated'), 'success', 5000);
                GlobalNotificationActions.appendGlobalNotification(notification);
            });
    },

    render() {
        return (
           <ReactS3FineUploader
                ref="fineuploader"
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
                setIsUploadReady={() =>{/* So that ReactS3FineUploader is not complaining */}}
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