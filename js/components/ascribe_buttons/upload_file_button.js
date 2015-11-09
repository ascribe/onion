'use strict';

import React from 'react';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';
import UploadButton from '../ascribe_uploader/ascribe_upload_button/upload_button';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import { getCookie } from '../../utils/fetch_api_utils';
import { formSubmissionValidation } from '../ascribe_uploader/react_s3_fine_uploader_utils';


const { shape, arrayOf, string, object, number, oneOfType } = React.PropTypes;

const UploadFileButton = React.createClass({
    propTypes: {
        keyRoutine: shape({
            url: string,
            fileClass: string
        }).isRequired,
        validation: shape({
            itemLimit: number,
            sizeLimit: oneOfType([string, number]),
            allowedExtensions: arrayOf(string)
        }),
        location: object,
        fileClassToUpload: shape({
            singular: string,
            plural: string
        }).isRequired,
        createBlobRoutine: shape({
            url: string,
            pieceId: number
        })
    },

    getInitialState() {
        return {
            file: null
        };
    },

    handleSubmitFile(file) {
        this.setState({
            file
        });
    },

    createBlobRoutine() {
        const { fineuploader } = this.refs;
        const { file } = this.state;

        fineuploader.createBlob(file);
    },

    render() {
        const { fileClassToUpload, validation, keyRoutine, createBlobRoutine } = this.props;

        return (
            <ReactS3FineUploader
                ref="fineuploader"
                fileInputElement={UploadButton}
                keyRoutine={keyRoutine}
                createBlobRoutine={createBlobRoutine}
                validation={validation}
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
                fileClassToUpload={fileClassToUpload}
                isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                submitFile={this.handleSubmitFile}
                location={this.props.location}/>
            );
    }
});

export default UploadFileButton;