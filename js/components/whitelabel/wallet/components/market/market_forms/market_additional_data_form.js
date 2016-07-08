'use strict';

import React from 'react';

import { atLeastOneCreatedBlobFile } from 'react-utility-belt/es6/uploader/utils/file_validation_utils';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import FurtherDetailsFileuploader from '../../../../../ascribe_detail/further_details_fileuploader';

import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';
import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';

import AscribeSpinner from '../../../../../ascribe_spinner';

import { ValidationParts, ValidationTypes } from '../../../../../../constants/uploader_constants';

import { getLangText } from '../../../../../../utils/lang';
import { formatText } from '../../../../../../utils/text';
import { resolveUrl } from '../../../../../../utils/url_resolver';


let MarketAdditionalDataForm = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number.isRequired,

        editable: React.PropTypes.bool,
        extraData: React.PropTypes.object,
        handleSuccess: React.PropTypes.func,
        isInline: React.PropTypes.bool,
        otherData: React.PropTypes.arrayOf(React.PropTypes.object),
        showHeading: React.PropTypes.bool,
        showNotification: React.PropTypes.bool,
        submitLabel: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            editable: true,
            submitLabel: getLangText('Register work')
        };
    },

    getInitialState() {
        return {
            // Allow the form to be submitted if there's already an additional image uploaded
            isUploadReady: this.isUploadReadyOnChange(),
            forceUpdateKey: 0
        }
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.extraData !== nextProps.extraData || this.props.otherData !== nextProps.otherData) {
            this.setState({
                // Allow the form to be submitted if the updated piece has an additional image uploaded
                isUploadReady: this.isUploadReadyOnChange(),

                /**
                 * Increment the forceUpdateKey to force the form to rerender on each change
                 *
                 * THIS IS A HACK TO MAKE SURE THE FORM ALWAYS DISPLAYS THE MOST RECENT STATE
                 * BECAUSE SOME OF OUR FORM ELEMENTS DON'T UPDATE FROM PROP CHANGES (ie.
                 * InputTextAreaToggable).
                 */
                forceUpdateKey: this.state.forceUpdateKey + 1
            });
        }
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
            extradata,
            piece_id: this.props.pieceId
        };
    },

    getUrl() {
        return formatText(resolveUrl('piece_extradata'), {
            pieceId: this.props.pieceId
        });
    },

    isUploadReadyOnChange() {
        return this.props.otherData && this.props.otherData.length;
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
        const { editable,
                extraData = {},
                isInline,
                handleSuccess,
                otherData,
                pieceId,
                showHeading,
                showNotification,
                submitLabel } = this.props;

        let buttons;
        let heading;
        let spinner;

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
                        <AscribeSpinner color='dark-blue' size='md' />
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

        if (pieceId) {
            return (
                <Form
                    className="ascribe-form-bordered"
                    ref='form'
                    key={this.state.forceUpdateKey}
                    url={this.getUrl()}
                    handleSuccess={showNotification ? this.handleSuccessWithNotification : handleSuccess}
                    getFormData={this.getFormData}
                    buttons={buttons}
                    spinner={spinner}
                    disabled={!this.props.editable}>
                    {heading}
                    <FurtherDetailsFileuploader
                        areAssetsDownloadable={!!isInline}
                        editable={editable}
                        isReadyForFormSubmission={atLeastOneCreatedBlobFile}
                        label={getLangText('Marketplace Thumbnail Image')}
                        otherData={otherData}
                        pieceId={pieceId}
                        setIsUploadReady={this.setIsUploadReady}
                        submitFile={function () {}}
                        validation={{
                            itemLimit: ValidationTypes.workThumbnail.itemLimit,
                            sizeLimit: ValidationTypes.workThumbnail.sizeLimit,
                            allowedExtensions: ValidationParts.allowedExtensions.images
                        }} />
                    <Property
                        name='artist_bio'
                        label={getLangText('Artist Bio')}
                        expanded={editable || !!extraData.artist_bio}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.artist_bio}
                            placeholder={getLangText('Enter a biography of the artist...')}
                            required />
                    </Property>
                    <Property
                        name='work_description'
                        label={getLangText('Work Description')}
                        expanded={editable || !!extraData.work_description}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.work_description}
                            placeholder={getLangText('Enter a description of the work...')}
                            required />
                    </Property>
                    <Property
                        name='technology_details'
                        label={getLangText('Technology Details')}
                        expanded={editable || !!extraData.technology_details}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.technology_details}
                            placeholder={getLangText('Enter technological details about the work...')}
                            required />
                    </Property>
                    <Property
                        name='display_instructions'
                        label={getLangText('Display Instructions')}
                        expanded={editable || !!extraData.display_instructions}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.display_instructions}
                            placeholder={getLangText('Enter instructions on how to best display the work...')}
                            required />
                    </Property>
                </Form>
            );
        } else {
            return (
                <div className="ascribe-loading-position">
                    <AscribeSpinner color='dark-blue' size='lg' />
                </div>
            );
        }
    }
});

export default MarketAdditionalDataForm;
