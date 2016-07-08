'use strict';

import React from 'react';

import { atLeastOneCreatedBlobFile } from 'react-utility-belt/es6/uploader/utils/file_validation_utils';

import ContractListActions from '../../actions/contract_list_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import InputFineUploader from './input_fineuploader';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

import AppConstants from '../../constants/application_constants';
import { ValidationTypes } from '../../constants/uploader_constants';

import { getLangText } from '../../utils/lang';
import { resolveUrl } from '../../utils/url_resolver';


let CreateContractForm = React.createClass({
    propTypes: {
        isPublic: React.PropTypes.bool,

        // A class of a file the user has to upload
        // Needs to be defined both in singular as well as in plural
        fileClassToUpload: React.PropTypes.shape({
            singular: React.PropTypes.string,
            plural: React.PropTypes.string
        })
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

    submitFile({ originalName }) {
        this.setState({
            contractName: originalName
        });

        this.refs.form.submit();
    },

    render() {
        return (
            <Form
                ref='form'
                url={resolveUrl('ownership_contract_list')}
                handleSuccess={this.handleCreateSuccess}>
                <Property
                    name="blob"
                    label={getLangText('Contract file (*.pdf only, max. 50MB per contract)')}>
                    <InputFineUploader
                        submitFile={this.submitFile}
                        keyRoutine={{
                            url: `${AppConstants.serverUrl}/s3/key/`,
                            fileClass: 'contract'
                        }}
                        createBlobRoutine={{
                            url: resolveUrl('blob_contracts')
                        }}
                        validation={{
                            itemLimit: ValidationTypes.additionalData.itemLimit,
                            sizeLimit: ValidationTypes.additionalData.sizeLimit,
                            allowedExtensions: ['pdf']
                        }}
                        areAssetsDownloadable={true}
                        areAssetsEditable={true}
                        setIsUploadReady={this.setIsUploadReady}
                        isReadyForFormSubmission={atLeastOneCreatedBlobFile}
                        fileClassToUpload={this.props.fileClassToUpload} />
                </Property>
                <Property
                    name='name'
                    label={getLangText('Contract name')}
                    expanded={false}>
                    <input
                        type="text"
                        value={this.state.contractName}/>
                </Property>
                <Property
                    name="is_public"
                    expanded={false}>
                    <input
                        type="checkbox"
                        value={this.props.isPublic} />
                </Property>
            </Form>
        );
    }
});

export default CreateContractForm;
