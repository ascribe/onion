'use strict';

import React from 'react';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';

import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import AscribeSpinner from '../../../../../ascribe_spinner';

import { getLangText } from '../../../../../../utils/lang';
import { formatText } from '../../../../../../utils/text';
import { resolveUrl } from '../../../../../../utils/url_resolver';


let IkonotvArtworkDetailsForm = React.createClass({
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
            piece_id: this.props.piece.id
        };
    },

    getUrl() {
        return formatText(resolveUrl('piece_extradata'), {
            pieceId: this.props.piece.id
        });
    },

    handleSuccess() {
        const notification = new GlobalNotificationModel(getLangText('Artwork details successfully updated'), 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        const { disabled, isInline, handleSuccess, piece } = this.props;

        let buttons;
        let spinner;
        let heading;

        if (!isInline) {
            buttons = (
                <button
                    type="submit"
                    className="btn btn-default btn-wide"
                    disabled={disabled}>
                    {getLangText('Proceed to artist details')}
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
                        {getLangText('Artwork Details')}
                    </h3>
                </div>
            );
        }

        if (piece.id && piece.extra_data) {
            const { extra_data: extraData = {} } = piece;

            return (
                <Form
                    disabled={disabled}
                    className="ascribe-form-bordered"
                    ref='form'
                    url={this.getUrl()}
                    handleSuccess={handleSuccess || this.handleSuccess}
                    getFormData={this.getFormData}
                    buttons={buttons}
                    spinner={spinner}>
                    {heading}
                    <Property
                        name='medium'
                        label={getLangText('Medium')}
                        expanded={!disabled || !!extraData.medium}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.medium}
                            placeholder={getLangText('The medium of the file (i.e. photo, video, other, ...)')} />
                    </Property>
                    <Property
                        name='size_duration'
                        label={getLangText('Size/Duration')}
                        expanded={!disabled || !!extraData.size_duration}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.size_duration}
                            placeholder={getLangText('Size in centimeters. Duration in minutes.')} />
                    </Property>
                    <Property
                        name='copyright'
                        label={getLangText('Copyright')}
                        expanded={!disabled || !!extraData.copyright}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.copyright}
                            placeholder={getLangText('Which copyright is attached to this work?')} />
                    </Property>
                    <Property
                        name='courtesy_of'
                        label={getLangText('Courtesy of')}
                        expanded={!disabled || !!extraData.courtesy_of}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.courtesy_of}
                            placeholder={getLangText('The current owner of the artwork')} />
                    </Property>
                    <Property
                        name='copyright_of_photography'
                        label={getLangText('Copyright of Photography')}
                        expanded={!disabled || !!extraData.copyright_of_photography}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.copyright_of_photography}
                            placeholder={getLangText('Who should be attributed for the photography?')} />
                    </Property>
                    <Property
                        name='additional_details'
                        label={getLangText('Additional Details about the artwork')}
                        expanded={!disabled || !!extraData.additional_details}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.additional_details}
                            placeholder={getLangText('Insert artwork overview')} />
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

export default IkonotvArtworkDetailsForm;
