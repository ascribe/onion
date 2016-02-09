'use strict';

import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import FurtherDetailsFileuploader from './further_details_fileuploader';

import Form from './../ascribe_forms/form';
import PieceExtraDataForm from './../ascribe_forms/form_piece_extradata';

import { formSubmissionValidation } from '../ascribe_uploader/react_s3_fine_uploader_utils';

import { getLangText } from '../../utils/lang_utils';


let FurtherDetails = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number.isRequired,

        editable: React.PropTypes.bool,
        extraData: React.PropTypes.object,
        handleSuccess: React.PropTypes.func,
        otherData: React.PropTypes.arrayOf(React.PropTypes.object),
    },

    getInitialState() {
        return {
            loading: false
        };
    },

    showNotification() {
        const { handleSuccess } = this.props;

        if (typeof handleSucess === 'function') {
            handleSuccess();
        }

        const notification = new GlobalNotificationModel(getLangText('Details updated'), 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    submitFile(file) {
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
        const { editable, extraData, otherData, pieceId } = this.props;

        return (
            <Row>
                <Col md={12} className="ascribe-edition-personal-note">
                    <PieceExtraDataForm
                        name='artist_contact_info'
                        title={getLangText('Artist Contact Info')}
                        convertLinks
                        editable={editable}
                        extraData={extraData}
                        handleSuccess={this.showNotification}
                        pieceId={pieceId} />
                    <PieceExtraDataForm
                        name='display_instructions'
                        title={getLangText('Display Instructions')}
                        editable={editable}
                        extraData={extraData}
                        handleSuccess={this.showNotification}
                        pieceId={pieceId} />
                    <PieceExtraDataForm
                        name='technology_details'
                        title={getLangText('Technology Details')}
                        editable={editable}
                        extraData={extraData}
                        handleSuccess={this.showNotification}
                        pieceId={pieceId} />
                    <Form>
                        <FurtherDetailsFileuploader
                            submitFile={this.submitFile}
                            setIsUploadReady={this.setIsUploadReady}
                            isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                            editable={editable}
                            overrideForm={true}
                            pieceId={pieceId}
                            otherData={otherData}
                            multiple={true} />
                    </Form>
                </Col>
            </Row>
        );
    }
});



export default FurtherDetails;
