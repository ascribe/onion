'use strict';

import React from 'react';

import AppConstants from '../constants/application_constants';
import fineUploader from 'fineUploader';

import ReactS3FineUploader from 'ReactS3FineUploader';

let RegisterPiece = React.createClass( {
    render() {

        return (
            <div>
                <ReactS3FineUploader
                    keyRoutine={{
                        url: AppConstants.serverUrl + 's3/key/',
                        fileClass: 'digitalwork'
                    }}
                    autoUpload={true}
                    debug={false}
                    objectProperties={{
                        acl: 'public-read',
                        bucket: 'ascribe0'
                    }}
                    request={{
                        endpoint: 'https://ascribe0.s3.amazonaws.com',
                        accessKey: 'AKIAIVCZJ33WSCBQ3QDA'
                    }}
                    signature={{
                        endpoint: AppConstants.serverUrl + 's3/signature/'
                    }}
                    uploadSuccess={{
                        params: {
                            isBrowserPreviewCapable: fineUploader.supportedFeatures.imagePreviews
                        }
                    }}
                    cors={{
                        expected: true
                    }}
                    chunking={{
                        enabled: true
                    }}
                    resume={{
                        enabled: true
                    }}
                    retry={{
                        enableAuto: false
                    }}
                    deleteFile={{
                        enabled: true,
                        method: 'DELETE',
                        endpoint: AppConstants.serverUrl + 's3/delete'
                    }}
                    validation={{
                        itemLimit: 100000,
                        sizeLimit: '25000000000'
                    }}
                    session={{
                        endpoint: null
                    }}
                    messages={{
                        unsupportedBrowser: '<h3>Upload is not functional in IE7 as IE7 has no support for CORS!</h3>'
                    }}
                    formatFileName={(name) => {// fix maybe
                        if (name !== undefined && name.length > 26) {
                            name = name.slice(0, 15) + '...' + name.slice(-15);
                        }
                        return name;
                    }}
                    multiple={true}/>
                </div>
        );
    }
});

export default RegisterPiece;