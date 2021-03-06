'use strict';

import React from 'react';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';

import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

import FurtherDetailsFileuploader from '../../../../../ascribe_detail/further_details_fileuploader';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import ApiUrls from '../../../../../../constants/api_urls';
import AscribeSpinner from '../../../../../ascribe_spinner';

import requests from '../../../../../../utils/requests';

import { getLangText } from '../../../../../../utils/lang_utils';
import { formSubmissionValidation } from '../../../../../ascribe_uploader/react_s3_fine_uploader_utils';


let CylandAdditionalDataForm = React.createClass({
    propTypes: {
        piece: React.PropTypes.object.isRequired,

        disabled: React.PropTypes.bool,
        handleSuccess: React.PropTypes.func,
        isInline: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            isInline: false
        };
    },

    getInitialState() {
        return {
            isUploadReady: true
        };
    },

    handleSuccess() {
        const notification = new GlobalNotificationModel(getLangText('Further details successfully updated'), 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getFormData() {
        const extradata = {};
        const formRefs = this.refs.form.refs;

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

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    render() {
        const { disabled, handleSuccess, isInline, piece } = this.props;

        let buttons;
        let spinner;
        let heading;

        if (!isInline) {
            buttons = (
                <button
                    type="submit"
                    className="btn btn-default btn-wide"
                    disabled={!this.state.isUploadReady || disabled}>
                    {getLangText('Proceed to loan')}
                </button>
            );

            spinner = (
                <div className="modal-footer">
                    <p className="pull-right">
                        <AscribeSpinner color='dark-blue' size='md' />
                    </p>
                </div>
            );

            heading = (
                <div className="ascribe-form-header">
                    <h3>
                        {getLangText('Provide supporting materials')}
                    </h3>
                </div>
            );
        }

        if (piece.id) {
            const { extra_data: extraData = {} } = piece;

            return (
                <Form
                    disabled={disabled}
                    className="ascribe-form-bordered"
                    ref='form'
                    url={requests.prepareUrl(ApiUrls.piece_extradata, { piece_id: piece.id })}
                    handleSuccess={handleSuccess || this.handleSuccess}
                    getFormData={this.getFormData}
                    buttons={buttons}
                    spinner={spinner}>
                    {heading}
                    <Property
                        name='artist_bio'
                        label={getLangText('Artist Biography')}
                        expanded={!disabled || !!extraData.artist_bio}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.artist_bio}
                            placeholder={getLangText('Enter the artist\'s biography...')} />
                    </Property>
                    <Property
                        name='artist_contact_information'
                        label={getLangText('Artist Contact Information')}
                        expanded={!disabled || !!extraData.artist_contact_information}>
                        <InputTextAreaToggable
                            rows={1}
                            convertLinks
                            defaultValue={extraData.artist_contact_information}
                            placeholder={getLangText('Enter the artist\'s contact information...')} />
                    </Property>
                    <Property
                        name='conceptual_overview'
                        label={getLangText('Conceptual Overview')}
                        expanded={!disabled || !!extraData.conceptual_overview}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.conceptual_overview}
                            placeholder={getLangText('Enter a conceptual overview...')} />
                    </Property>
                    <Property
                        name='medium'
                        label={getLangText('Medium (technical specifications)')}
                        expanded={!disabled || !!extraData.medium}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.medium}
                            placeholder={getLangText('Enter the medium (and other technical specifications)...')} />
                    </Property>
                    <Property
                        name='size_duration'
                        label={getLangText('Size / Duration')}
                        expanded={!disabled || !!extraData.size_duration}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.size_duration}
                            placeholder={getLangText('Enter the size / duration...')} />
                    </Property>
                    <Property
                        name='display_instructions'
                        label={getLangText('Display instructions')}
                        expanded={!disabled || !!extraData.display_instructions}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.display_instructions}
                            placeholder={getLangText('Enter the display instructions...')} />
                    </Property>
                    <Property
                        name='additional_details'
                        label={getLangText('Additional details')}
                        expanded={!disabled || !!extraData.additional_details}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.additional_details}
                            placeholder={getLangText('Enter additional details...')} />
                    </Property>
                    <FurtherDetailsFileuploader
                        label={getLangText('Additional files (e.g. still images, pdf)')}
                        submitFile={function () {}}
                        setIsUploadReady={this.setIsUploadReady}
                        isReadyForFormSubmission={formSubmissionValidation.fileOptional}
                        pieceId={piece.id}
                        otherData={piece.other_data}
                        multiple={true} />
                </Form>
            );
        } else {
            return (
                <div className="ascribe-loading-position">
                    <AscribeSpinner color='dark-blue' size='md' />
                </div>
            );
        }
    }
});

export default CylandAdditionalDataForm;
