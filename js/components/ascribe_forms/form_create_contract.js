'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';
import InputCheckbox from '../ascribe_forms/input_checkbox';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import ContractListActions from '../../actions/contract_list_actions';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import InputFineUploader from './input_fineuploader';

import { getLangText } from '../../utils/lang_utils';
import { formSubmissionValidation } from '../ascribe_uploader/react_s3_fine_uploader_utils';


let CreateContractForm = React.createClass({

    getInitialState() {
        return {
            isUploadReady: false,
            contractName: ''
        };
    },

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    handleCreateSuccess(response) {
        ContractListActions.fetchContractList({is_active: 'True'});
        let notification = new GlobalNotificationModel(getLangText('Contract %s successfully created', response.name), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
        this.refs.form.reset();
    },

    submitFileName(fileName) {
        this.setState({
            contractName: fileName
        });

        this.refs.form.submit();
    },

    render() {
        return (
            <Form
                ref='form'
                url={ApiUrls.ownership_contract_list}
                handleSuccess={this.handleCreateSuccess}>
                <Property
                    name="blob"
                    label="Contract file (*.pdf)">
                    <InputFineUploader
                        submitFileName={this.submitFileName}
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
                        areAssetsDownloadable={true}
                        areAssetsEditable={true}
                        submitFile={this.submitFile}
                        setIsUploadReady={this.setIsUploadReady}
                        isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                        fileClassToUpload={{
                            singular: 'contract',
                            plural: 'contracts'
                        }}/>
                </Property>
                <Property
                    name='name'
                    label={getLangText('Contract name')}
                    hidden={true}>
                    <input
                        type="text"
                        value={this.state.contractName}/>
                </Property>
            </Form>
        );
    }
});

export default CreateContractForm;