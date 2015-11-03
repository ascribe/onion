'use strict';

import React from 'react';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';

import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

import FurtherDetailsFileuploader from '../../../../../ascribe_detail/further_details_fileuploader';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import { formSubmissionValidation } from '../../../../../ascribe_uploader/react_s3_fine_uploader_utils';

import ApiUrls from '../../../../../../constants/api_urls';
import AppConstants from '../../../../../../constants/application_constants';

import requests from '../../../../../../utils/requests';
import { getLangText } from '../../../../../../utils/lang_utils';

let LumenusAdditionalDataForm = React.createClass({
    propTypes: {
        handleSuccess: React.PropTypes.func,
        piece: React.PropTypes.shape({
            id: React.PropTypes.number,
            extra_data: React.PropTypes.object,
            other_data: React.PropTypes.arrayOf(React.PropTypes.object)
        }).isRequired,
        isInline: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            isInline: false
        };
    },

    getInitialState() {
        return {
            isUploadReady: false
        };
    },

    handleSuccess() {
        let notification = new GlobalNotificationModel(getLangText('Further details successfully updated'), 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getFormData() {
        let extradata = {};
        let formRefs = this.refs.form.refs;

        // Put additional fields in extra data object
        Object
            .keys(formRefs)
            .forEach((fieldName) => {
                extradata[fieldName] = formRefs[fieldName].state.value;
            });

        return {
            extradata: extradata,
            piece_id: this.props.piece.id
        };
    },

    uploadStarted() {
        this.setState({
            isUploadReady: false
        });
    },

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    render() {
        let { piece, isInline, handleSuccess } = this.props;
        let buttons, spinner, heading;

        if (!isInline) {
            buttons = (
                <button
                    type="submit"
                    className="btn btn-default btn-wide"
                    disabled={!this.state.isUploadReady}>
                    {getLangText('Register work')}
                </button>
            );

            spinner = (
                <div className="modal-footer">
                    <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_small.gif'} />
                </div>
            );

            heading = (
                <div className="ascribe-form-header">
                    <h3>
                        {getLangText('Provide additional details')}
                    </h3>
                </div>
            );
        }

        if (piece && piece.id) {
            return (
                <Form
                    className="ascribe-form-bordered"
                    ref='form'
                    url={requests.prepareUrl(ApiUrls.piece_extradata, {piece_id: piece.id})}
                    handleSuccess={handleSuccess || this.handleSuccess}
                    getFormData={this.getFormData}
                    buttons={buttons}
                    spinner={spinner}>
                    {heading}
                    <FurtherDetailsFileuploader
                        label={getLangText('Marketplace image')}
                        uploadStarted={this.uploadStarted}
                        submitFile={function () {}}
                        setIsUploadReady={this.setIsUploadReady}
                        isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                        pieceId={piece.id}
                        otherData={piece.other_data} />
                    <Property
                        name='artist_bio'
                        label={getLangText('Artist Bio')}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={piece.extra_data.artist_bio}
                            placeholder={getLangText('Enter a biography of the artist...')}
                            required />
                    </Property>
                    <Property
                        name='work_description'
                        label={getLangText('Work Description')}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={piece.extra_data.work_description}
                            placeholder={getLangText('Enter a description of the work...')}
                            required />
                    </Property>
                    <Property
                        name='tech_details'
                        label={getLangText('Technology Details')}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={piece.extra_data.tech_details}
                            placeholder={getLangText('Enter technological details about the work was produced...')}
                            required />
                    </Property>
                    <Property
                        name='display_instructions'
                        label={getLangText('Display Instructions')}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={piece.extra_data.display_instructions}
                            placeholder={getLangText('Enter instructions on how to best display the work...')}
                            required />
                    </Property>
                </Form>
            );
        } else {
            return (
                <div className="ascribe-loading-position">
                    <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
                </div>
            );
        }
    }
});

export default LumenusAdditionalDataForm;
