'use strict';

import React from 'react';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import { getCookie } from '../../utils/fetch_api_utils';

let InputFileUploader = React.createClass({
    propTypes: {
        setIsUploadReady: React.PropTypes.func,
        isReadyForFormSubmission: React.PropTypes.func,
        onClick: React.PropTypes.func,

        // isFineUploaderActive is used to lock react fine uploader in case
        // a user is actually not logged in already to prevent him from droping files
        // before login in
        isFineUploaderActive: React.PropTypes.bool,
        onLoggedOut: React.PropTypes.func,
        editable: React.PropTypes.bool,
        enableLocalHashing: React.PropTypes.bool,

        // provided by Property
        disabled: React.PropTypes.bool
    },

    getInitialState() {
        return {
            value: null

        };
    },

    submitKey(key){
        this.setState({
            value: key
        });
    },

    render() {

        let editable = this.props.isFineUploaderActive;

        // if disabled is actually set by property, we want to override
        // isFineUploaderActive
        if(typeof this.props.disabled !== 'undefined') {
            editable = !this.props.disabled;
        }


        return (
            <ReactS3FineUploader
                onClick={this.props.onClick}
                keyRoutine={{
                    url: AppConstants.serverUrl + 's3/key/',
                    fileClass: 'digitalwork'
                }}
                createBlobRoutine={{
                    url: ApiUrls.blob_digitalworks
                }}
                submitKey={this.submitKey}
                validation={{
                    itemLimit: 100000,
                    sizeLimit: '25000000000'
                }}
                setIsUploadReady={this.props.setIsUploadReady}
                isReadyForFormSubmission={this.props.isReadyForFormSubmission}
                areAssetsDownloadable={false}
                areAssetsEditable={editable}
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
                onInactive={this.props.onLoggedOut}
                enableLocalHashing={this.props.enableLocalHashing} />
        );
    }
});

export default InputFileUploader;