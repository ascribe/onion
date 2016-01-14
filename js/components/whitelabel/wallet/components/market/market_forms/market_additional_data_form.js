'use strict';

import React from 'react';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';

import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

import FurtherDetailsFileuploader from '../../../../../ascribe_detail/further_details_fileuploader';
import AscribeSpinner from '../../../../../ascribe_spinner';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import { formSubmissionValidation } from '../../../../../ascribe_uploader/react_s3_fine_uploader_utils';

import PieceActions from '../../../../../../actions/piece_actions';
import PieceStore from '../../../../../../stores/piece_store';

import ApiUrls from '../../../../../../constants/api_urls';
import AppConstants from '../../../../../../constants/application_constants';

import requests from '../../../../../../utils/requests';
import { mergeOptions } from '../../../../../../utils/general_utils';
import { getLangText } from '../../../../../../utils/lang_utils';


let MarketAdditionalDataForm = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number,
        editable: React.PropTypes.bool,
        isInline: React.PropTypes.bool,
        showHeading: React.PropTypes.bool,
        showNotification: React.PropTypes.bool,
        submitLabel: React.PropTypes.string,
        handleSuccess: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            editable: true,
            submitLabel: getLangText('Register work')
        };
    },

    getInitialState() {
        const pieceStore = PieceStore.getState();

        return mergeOptions(
            pieceStore,
            {
                // Allow the form to be submitted if there's already an additional image uploaded
                isUploadReady: this.isUploadReadyOnChange(pieceStore.piece),
                forceUpdateKey: 0
            });
    },

    componentDidMount() {
        PieceStore.listen(this.onChange);

        if (this.props.pieceId) {
            PieceActions.fetchPiece(this.props.pieceId);
        }
    },

    componentWillUnmount() {
        PieceStore.unlisten(this.onChange);
    },

    onChange(state) {
        Object.assign({}, state, {
            // Allow the form to be submitted if the updated piece already has an additional image uploaded
            isUploadReady: this.isUploadReadyOnChange(state.piece),

            /**
             * Increment the forceUpdateKey to force the form to rerender on each change
             *
             * THIS IS A HACK TO MAKE SURE THE FORM ALWAYS DISPLAYS THE MOST RECENT STATE
             * BECAUSE SOME OF OUR FORM ELEMENTS DON'T UPDATE FROM PROP CHANGES (ie.
             * InputTextAreaToggable).
             */
            forceUpdateKey: this.state.forceUpdateKey + 1
        });

        this.setState(state);
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
            piece_id: this.state.piece.id
        };
    },

    isUploadReadyOnChange(piece) {
        return piece && piece.other_data && piece.other_data.length > 0;
    },

    handleSuccessWithNotification() {
        if (typeof this.props.handleSuccess === 'function') {
            this.props.handleSuccess();
        }

        const notification = new GlobalNotificationModel(getLangText('Further details successfully updated'), 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    setIsUploadReady(isReady) {
        this.setState({
            isUploadReady: isReady
        });
    },

    render() {
        const { editable, isInline, handleSuccess, showHeading, showNotification, submitLabel } = this.props;
        const { piece } = this.state;
        let buttons, heading;

        let spinner = <AscribeSpinner color='dark-blue' size='lg' />;

        if (!isInline) {
            buttons = (
                <button
                    type="submit"
                    className="btn btn-default btn-wide"
                    disabled={!this.state.isUploadReady}>
                    {submitLabel}
                </button>
            );

            spinner = (
                <div className="modal-footer">
                    <p className="pull-right">
                        {spinner}
                    </p>
                </div>
            );

            heading = showHeading ? (
                <div className="ascribe-form-header">
                    <h3>
                        {getLangText('Provide additional details')}
                    </h3>
                </div>
            ) : null;
        }

        if (piece.id) {
            return (
                <Form
                    className="ascribe-form-bordered"
                    ref='form'
                    key={this.state.forceUpdateKey}
                    url={requests.prepareUrl(ApiUrls.piece_extradata, {piece_id: piece.id})}
                    handleSuccess={showNotification ? this.handleSuccessWithNotification : handleSuccess}
                    getFormData={this.getFormData}
                    buttons={buttons}
                    spinner={spinner}
                    disabled={!this.props.editable || !piece.acl.acl_edit}>
                    {heading}
                    <FurtherDetailsFileuploader
                        label={getLangText('Marketplace Thumbnail Image')}
                        submitFile={function () {}}
                        setIsUploadReady={this.setIsUploadReady}
                        isReadyForFormSubmission={formSubmissionValidation.atLeastOneUploadedFile}
                        pieceId={piece.id}
                        otherData={piece.other_data}
                        editable={editable} />
                    <Property
                        name='artist_bio'
                        label={getLangText('Artist Bio')}
                        expanded={editable || !!piece.extra_data.artist_bio}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={piece.extra_data.artist_bio}
                            placeholder={getLangText('Enter a biography of the artist...')}
                            required />
                    </Property>
                    <Property
                        name='work_description'
                        label={getLangText('Work Description')}
                        expanded={editable || !!piece.extra_data.work_description}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={piece.extra_data.work_description}
                            placeholder={getLangText('Enter a description of the work...')}
                            required />
                    </Property>
                    <Property
                        name='technology_details'
                        label={getLangText('Technology Details')}
                        expanded={editable || !!piece.extra_data.technology_details}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={piece.extra_data.technology_details}
                            placeholder={getLangText('Enter technological details about the work...')}
                            required />
                    </Property>
                    <Property
                        name='display_instructions'
                        label={getLangText('Display Instructions')}
                        expanded={editable || !!piece.extra_data.display_instructions}>
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
                    {spinner}
                </div>
            );
        }
    }
});

export default MarketAdditionalDataForm;
