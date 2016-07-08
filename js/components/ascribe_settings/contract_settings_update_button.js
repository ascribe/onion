'use strict';

import React from 'react';

import { atLeastOneCreatedBlobFile } from 'react-utility-belt/es6/uploader/utils/file_validation_utils';

import ContractListActions from '../../actions/contract_list_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';
import UploadButton from '../ascribe_uploader/ascribe_upload_button/upload_button';

import AppConstants from '../../constants/application_constants';
import { ValidationTypes } from '../../constants/uploader_constants';

import { makeCsrfHeader } from '../../utils/csrf';
import { getLangText } from '../../utils/lang';
import { resolveUrl } from '../../utils/url_resolver';


let ContractSettingsUpdateButton = React.createClass({
    propTypes: {
        contract: React.PropTypes.object
    },

    submitFile(file) {
        // override the blob with the key's value
        const contract = Object.assign(this.props.contract, { blob: file.key });

        // send it to the server
        ContractListActions
            .changeContract(contract)
            .then((res) => {
                // Display feedback to the user
                const notification = new GlobalNotificationModel(getLangText('Contract %s successfully updated', contract.name), 'success', 5000);
                GlobalNotificationActions.appendGlobalNotification(notification);

                // and refresh the contract list to get the updated contracs
                return ContractListActions
                            .fetchContractList(true)
                            // Also, reset the fineuploader component if fetch is successful so that the user can again 'update' his contract
                            .then(this.refs.fineuploader.reset)
                            .catch((err) => {
                                const notification = new GlobalNotificationModel(getLangText('Latest contract failed to load'), 'danger', 5000);
                                GlobalNotificationActions.appendGlobalNotification(notification);

                                return Promise.reject(err);
                            });
            }, (err) => {
                const notification = new GlobalNotificationModel(getLangText('Contract could not be updated'), 'danger', 5000);
                GlobalNotificationActions.appendGlobalNotification(notification);

                return Promise.reject(err);
            })
            .catch(console.logGlobal);
    },

    render() {
        return (
           <ReactS3FineUploader
               ref='fineuploader'
               fileInputElement={UploadButton({ showFileLabel: false })}
               keyRoutine={{
                   url: `${AppConstants.serverUrl}/s3/key/`,
                   fileClass: 'contract'
               }}
               createBlobRoutine={{
                   url: resolveUrl('blob_contracts')
               }}
               validation={{
                   itemLimit: ValidationTypes.registerWork.itemLimit,
                   sizeLimit: ValidationTypes.additionalData.sizeLimit,
                   allowedExtensions: ['pdf']
               }}
               setIsUploadReady={() =>{/* So that ReactS3FineUploader is not complaining */}}
               signature={{
                   endpoint: `${AppConstants.serverUrl}/s3/signature/`,
                   customHeaders: makeCsrfHeader()
               }}
               deleteFile={{
                   enabled: true,
                   method: 'DELETE',
                   endpoint: `${AppConstants.serverUrl}/s3/delete`,
                   customHeaders: makeCsrfHeader()
               }}
               fileClassToUpload={{
                   singular: getLangText('UPDATE'),
                   plural: getLangText('UPDATE')
               }}
               isReadyForFormSubmission={atLeastOneCreatedBlobFile}
               submitFile={this.submitFile} />
        );
    }
});

export default ContractSettingsUpdateButton;
