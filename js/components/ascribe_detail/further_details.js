'use strict';

import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';


import Form from './../ascribe_forms/form';
import Property from './../ascribe_forms/property';

import PieceExtraDataForm from './../ascribe_forms/form_piece_extradata';

import ReactS3FineUploader from './../ascribe_uploader/react_s3_fine_uploader';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import apiUrls from '../../constants/api_urls';
import AppConstants from '../../constants/application_constants';

import { getCookie } from '../../utils/fetch_api_utils';

let FurtherDetails = React.createClass({
    propTypes: {
        content: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },

    getInitialState() {
        return {
            loading: false
        };
    },

    showNotification(){
        this.props.handleSuccess();
        let notification = new GlobalNotificationModel('Details updated', 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    submitKey(key){
        this.setState({
            otherDataKey: key
        });
    },

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    isReadyForFormSubmission(files) {
        files = files.filter((file) => file.status !== 'deleted' && file.status !== 'canceled');
        if(files.length > 0 && files[0].status === 'upload successful') {
            return true;
        } else {
            return false;
        }
    },

    render() {
        let editable = this.props.content.acl.indexOf('edit') > -1;
        return (<span />);
        //return (
        //    <Row>
        //        <Col md={12} className="ascribe-edition-personal-note">
        //            <PieceExtraDataForm
        //                name='artist_contact_info'
        //                title='Artist Contact Info'
        //                handleSuccess={this.showNotification}
        //                editable={editable}
        //                content={this.props.content} />
        //            <PieceExtraDataForm
        //                name='display_instructions'
        //                title='Display Instructions'
        //                handleSuccess={this.showNotification}
        //                editable={editable}
        //                content={this.props.content} />
        //            <PieceExtraDataForm
        //                name='technology_details'
        //                title='Technology Details'
        //                handleSuccess={this.showNotification}
        //                editable={editable}
        //                content={this.props.content} />
        //            <FileUploader
        //                submitKey={this.submitKey}
        //                setIsUploadReady={this.setIsUploadReady}
        //                isReadyForFormSubmission={this.isReadyForFormSubmission}
        //                editable={editable}
        //                content={this.props.content}/>
        //        </Col>
        //    </Row>
        //);
    }
});

let FileUploader = React.createClass({
    propTypes: {
        content: React.PropTypes.object,
        setIsUploadReady: React.PropTypes.func,
        submitKey: React.PropTypes.func,
        isReadyForFormSubmission: React.PropTypes.func,
        editable: React.PropTypes.bool
    },

    render() {
        // Essentially there a three cases important to the fileuploader
        //
        // 1. there is no other_data => do not show the fileuploader at all
        // 2. there is other_data, but user has no edit rights => show fileuploader but without action buttons
        // 3. both other_data and editable are defined or true => show fileuploade with all action buttons
        if (!this.props.editable && !this.props.content.other_data){
            return null;
        }
        return (
            <Form>
                <Property
                    label="Additional files">
                    <ReactS3FineUploader
                        keyRoutine={{
                            url: AppConstants.serverUrl + 's3/key/',
                            fileClass: 'otherdata',
                            bitcoinId: this.props.content.bitcoin_id
                        }}
                        createBlobRoutine={{
                            url: apiUrls.blob_otherdatas,
                            bitcoinId: this.props.content.bitcoin_id
                        }}
                        validation={{
                            itemLimit: 100000,
                            sizeLimit: '10000000'
                        }}
                        submitKey={this.props.submitKey}
                        setIsUploadReady={this.props.setIsUploadReady}
                        isReadyForFormSubmission={this.props.isReadyForFormSubmission}
                        session={{
                            endpoint: AppConstants.serverUrl + 'api/blob/otherdatas/fineuploader_session/',
                            customHeaders: {
                                'X-CSRFToken': getCookie('csrftoken')
                            },
                            params: {
                                'pk': this.props.content.other_data ? this.props.content.other_data.id : null
                            },
                            cors: {
                                expected: true,
                                sendCredentials: true
                            }
                        }}
                        signature={{
                            endpoint: AppConstants.serverUrl + 's3/signature/',
                            customHeaders: {
                               'X-CSRFToken': getCookie('csrftoken')
                            }
                        }}
                        deleteFile={{
                            enabled: true,
                            method: 'DELETE',
                            endpoint: AppConstants.serverUrl + 's3/delete',
                            customHeaders: {
                               'X-CSRFToken': getCookie('csrftoken')
                            }
                        }}
                        areAssetsDownloadable={true}
                        areAssetsEditable={this.props.editable}/>
                </Property>
                <hr />
            </Form>
        );
    }
});

export default FurtherDetails;
