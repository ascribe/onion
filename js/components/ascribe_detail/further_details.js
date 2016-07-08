import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { atLeastOneCreatedBlobFile } from 'react-utility-belt/es6/uploader/utils/file_validation_utils';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import FurtherDetailsFileuploader from './further_details_fileuploader';

import Form from './../ascribe_forms/form';
import PieceExtraDataForm from './../ascribe_forms/form_piece_extradata';

import { getLangText } from '../../utils/lang';


const FurtherDetails = React.createClass({
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

    // FIXME: add this to the uploader too
    showNotification() {
        const { handleSuccess } = this.props;

        if (typeof handleSucess === 'function') {
            handleSuccess();
        }

        const notification = new GlobalNotificationModel(getLangText('Details updated'), 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        const { editable, extraData, otherData, pieceId } = this.props;

        return (
            <Row>
                <Col className="ascribe-edition-personal-note" md={12}>
                    <PieceExtraDataForm
                        convertLinks
                        editable={editable}
                        extraData={extraData}
                        handleSuccess={this.showNotification}
                        name='artist_contact_info'
                        pieceId={pieceId}
                        title={getLangText('Artist Contact Info')} />
                    <PieceExtraDataForm
                        editable={editable}
                        extraData={extraData}
                        handleSuccess={this.showNotification}
                        name='display_instructions'
                        pieceId={pieceId}
                        title={getLangText('Display Instructions')} />
                    <PieceExtraDataForm
                        editable={editable}
                        extraData={extraData}
                        handleSuccess={this.showNotification}
                        name='technology_details'
                        pieceId={pieceId}
                        title={getLangText('Technology Details')} />
                    <Form>
                        <FurtherDetailsFileuploader
                            multiple
                            overrideForm
                            editable={editable}
                            isReadyForFormSubmission={atLeastOneCreatedBlobFile}
                            otherData={otherData}
                            pieceId={pieceId} />
                    </Form>
                </Col>
            </Row>
        );
    }
});


export default FurtherDetails;
