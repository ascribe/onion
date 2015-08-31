'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

import CollapsibleParagraph from '../ascribe_collapsible/collapsible_paragraph';

import ReactS3FineUploader from '../ascribe_uploader/react_s3_fine_uploader';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import { getCookie } from '../../utils/fetch_api_utils';
import { getLangText } from '../../utils/lang_utils';


let ContractSettings = React.createClass({
    propTypes: {
        defaultExpanded: React.PropTypes.bool
    },

    render() {
        return (
            <CollapsibleParagraph
                title={getLangText('Contract Settings')}
                show={true}
                defaultExpanded={this.props.defaultExpanded}>
                <Form>
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
                            session={{
                                endpoint: ApiUrls.blob_contracts,
                                customHeaders: {
                                    'X-CSRFToken': getCookie(AppConstants.csrftoken)
                                },
                                cors: {
                                    expected: true,
                                    sendCredentials: true
                                }
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
                            areAssetsEditable={true}/>
                    </Property>
                    <hr />
                </Form>
            </CollapsibleParagraph>
        );
    }
});

export default ContractSettings;