'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import { getLangText } from '../../utils/lang_utils';
import { getCookie } from '../../utils/fetch_api_utils';
import { formSubmissionValidation } from '../ascribe_uploader/react_s3_fine_uploader_utils';

let CreateContractForm = React.createClass({

    getInitialState() {
        return {
            contractKey: null,
            isUploadReady: false
        };
    },

    getFormData(){
        return {
            blob: this.state.contractKey
        };
    },

    submitKey(key) {
        this.setState({
            contractKey: key
        });
    },

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    render() {
        return (
            <Form
                url={ApiUrls.ownership_contract}
                getFormData={this.getFormData}
                buttons={
                    <button
                        type="submit"
                        className="btn ascribe-btn ascribe-btn-login"
                        disabled={!this.state.isUploadReady}>
                        {getLangText('Create new contract')}
                    </button>
                }
                spinner={
                    <span className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                    </span>
                }>
                <Property
                    label="Contract file">
                    <ReactS3FineUploader
                        keyRoutine={{
                            url: AppConstants.serverUrl + 's3/key/',
                            fileClass: 'contract'
                        }}
                        createBlobRoutine={{
                            url: ApiUrls.blob_contracts
                        }}
                        validation={{
                            itemLimit: 100000,
                            sizeLimit: '50000000'
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
                        areAssetsEditable={true}
                        submitKey={this.submitKey}
                        setIsUploadReady={this.setIsUploadReady}
                        isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}/>
                </Property>
                <Property
                    name='contract_name'
                    label={getLangText('Contract name')}>
                    <input
                        type="text"
                        placeholder="(e.g. Loan agreement #1)"
                        required/>
                </Property>
            </Form>
        );
    }
});

export default CreateContractForm;