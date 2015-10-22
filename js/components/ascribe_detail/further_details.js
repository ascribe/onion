'use strict';

import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import Form from './../ascribe_forms/form';

import PieceExtraDataForm from './../ascribe_forms/form_piece_extradata';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import FurtherDetailsFileuploader from './further_details_fileuploader';

import { formSubmissionValidation } from '../ascribe_uploader/react_s3_fine_uploader_utils';


let FurtherDetails = React.createClass({
    propTypes: {
        editable: React.PropTypes.bool,
        pieceId: React.PropTypes.number,
        extraData: React.PropTypes.object,
        otherData: React.PropTypes.arrayOf(React.PropTypes.object),
        handleSuccess: React.PropTypes.func,
        location: React.PropTypes.object
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

    submitFile(file){
        this.setState({
            otherDataKey: file.key
        });
    },

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    render() {
        return (
            <Row>
                <Col md={12} className="ascribe-edition-personal-note">
                    <PieceExtraDataForm
                        name='artist_contact_info'
                        title='Artist Contact Info'
                        handleSuccess={this.showNotification}
                        editable={this.props.editable}
                        pieceId={this.props.pieceId}
                        extraData={this.props.extraData}
                        />
                    <PieceExtraDataForm
                        name='display_instructions'
                        title='Display Instructions'
                        handleSuccess={this.showNotification}
                        editable={this.props.editable}
                        pieceId={this.props.pieceId}
                        extraData={this.props.extraData} />
                    <PieceExtraDataForm
                        name='technology_details'
                        title='Technology Details'
                        handleSuccess={this.showNotification}
                        editable={this.props.editable}
                        pieceId={this.props.pieceId}
                        extraData={this.props.extraData} />
                    <Form>
                        <FurtherDetailsFileuploader
                            submitFile={this.submitFile}
                            setIsUploadReady={this.setIsUploadReady}
                            isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                            editable={this.props.editable}
                            overrideForm={true}
                            pieceId={this.props.pieceId}
                            otherData={this.props.otherData}
                            multiple={true}
                            location={this.props.location}/>
                    </Form>
                </Col>
            </Row>
        );
    }
});



export default FurtherDetails;
