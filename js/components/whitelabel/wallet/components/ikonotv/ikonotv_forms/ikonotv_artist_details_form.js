'use strict';

import React from 'react';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';

import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import AscribeSpinner from '../../../../../ascribe_spinner';

import { getLangText } from '../../../../../../utils/lang';
import requests from '../../../../../../utils/requests';
import { resolveUrl } from '../../../../../../utils/url_resolver';


let IkonotvArtistDetailsForm = React.createClass({
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
            extradata: extradata,
            piece_id: this.props.piece.id
        };

    },

    handleSuccess() {
        const notification = new GlobalNotificationModel(getLangText('Artist details successfully updated'), 'success', 10000);
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
                        {getLangText('Artist Details')}
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
                    url={requests.prepareUrl(resolveUrl('piece_extradata'), { piece_id: piece.id })}
                    handleSuccess={handleSuccess || this.handleSuccess}
                    getFormData={this.getFormData}
                    buttons={buttons}
                    spinner={spinner}>
                    {heading}
                    <Property
                        name='artist_website'
                        label={getLangText('Artist Website')}
                        expanded={!disabled || !!extraData.artist_website}>
                        <InputTextAreaToggable
                            rows={1}
                            convertLinks
                            defaultValue={extraData.artist_website}
                            placeholder={getLangText('The artist\'s website if present...')} />
                    </Property>
                    <Property
                        name='gallery_website'
                        label={getLangText('Website of related Gallery, Museum, etc.')}
                        expanded={!disabled || !!extraData.gallery_website}>
                        <InputTextAreaToggable
                            rows={1}
                            convertLinks
                            defaultValue={extraData.gallery_website}
                            placeholder={getLangText('The website of any related Gallery or Museum')} />
                    </Property>
                    <Property
                        name='additional_websites'
                        label={getLangText('Additional Websites/Publications/Museums/Galleries')}
                        expanded={!disabled || !!extraData.additional_websites}>
                        <InputTextAreaToggable
                            rows={1}
                            convertLinks
                            defaultValue={extraData.additional_websites}
                            placeholder={getLangText('Enter additional Websites/Publications if any')} />
                    </Property>
                    <Property
                        name='conceptual_overview'
                        label={getLangText('Short text about the Artist')}
                        expanded={!disabled || !!extraData.conceptual_overview}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={extraData.conceptual_overview}
                            placeholder={getLangText('Enter a short bio about the Artist')} />
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

export default IkonotvArtistDetailsForm;
