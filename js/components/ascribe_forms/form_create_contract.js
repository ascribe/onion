'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import ContractListActions from '../../actions/contract_list_actions';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import InputFineUploader from './input_fineuploader';

import { getLangText } from '../../utils/lang_utils';
import { formSubmissionValidation } from '../ascribe_uploader/react_s3_fine_uploader_utils';


let CreateContractForm = React.createClass({
    propTypes: {
        isPublic: React.PropTypes.bool,

        // A class of a file the user has to upload
        // Needs to be defined both in singular as well as in plural
        fileClassToUpload: React.PropTypes.shape({
            singular: React.PropTypes.string,
            plural: React.PropTypes.string
        }),
        location: React.PropTypes.object
    },

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
        ContractListActions.fetchContractList(true);
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
                    label={getLangText('Contract file (*.pdf only, max. 50MB per contract)')}>
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
                            itemLimit: AppConstants.fineUploader.validation.additionalData.itemLimit,
                            sizeLimit: AppConstants.fineUploader.validation.additionalData.sizeLimit,
                            allowedExtensions: ['pdf']
                        }}
                        areAssetsDownloadable={true}
                        areAssetsEditable={true}
                        setIsUploadReady={this.setIsUploadReady}
                        isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                        fileClassToUpload={this.props.fileClassToUpload}
                        location={this.props.location}/>
                </Property>
                <Property
                    name='name'
                    label={getLangText('Contract name')}
                    hidden={true}>
                    <input
                        type="text"
                        value={this.state.contractName}/>
                </Property>
                <Property
                    name="is_public"
                    hidden={true}>
                    <input
                        type="checkbox"
                        value={this.props.isPublic} />
                </Property>
            </Form>
        );
    }
});

export default CreateContractForm;