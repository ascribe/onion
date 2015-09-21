'use strict';

import React from 'react';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';

import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import ApiUrls from '../../../../../../constants/api_urls';
import AppConstants from '../../../../../../constants/application_constants';

import requests from '../../../../../../utils/requests';

import { getLangText } from '../../../../../../utils/lang_utils';


let IkonotvArtworkDetailsForm = React.createClass({
    propTypes: {
        handleSuccess: React.PropTypes.func,
        piece: React.PropTypes.object.isRequired,

        disabled: React.PropTypes.bool,

        isInline: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            isInline: false
        };
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

    handleSuccess() {
        let notification = new GlobalNotificationModel('Artwork details successfully updated', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        let buttons, spinner, heading;
        let { isInline, handleSuccess } = this.props;

        if(!isInline) {
            buttons = (
                <button
                    type="submit"
                    className="btn ascribe-btn ascribe-btn-login"
                    disabled={this.props.disabled}>
                    {getLangText('Proceed to loan')}
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
                        {getLangText('Artwork Details')}
                    </h3>
                </div>
            );
        }

        if(this.props.piece && this.props.piece.id && this.props.piece.extra_data) {
            return (
                <Form
                    disabled={this.props.disabled}
                    className="ascribe-form-bordered"
                    ref='form'
                    url={requests.prepareUrl(ApiUrls.piece_extradata, {piece_id: this.props.piece.id})}
                    handleSuccess={handleSuccess || this.handleSuccess}
                    getFormData={this.getFormData}
                    buttons={buttons}
                    spinner={spinner}>
                    {heading}
                    <Property
                        name='medium'
                        label={getLangText('Medium')}
                        hidden={this.props.disabled && !this.props.piece.extra_data.medium}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={this.props.piece.extra_data.medium}
                            placeholder={getLangText('The medium of the file (i.e. photo, video, other, ...)')}/>
                    </Property>
                    <Property
                        name='size_duration'
                        label={getLangText('Size/Duration')}
                        hidden={this.props.disabled && !this.props.piece.extra_data.size_duration}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={this.props.piece.extra_data.size_duration}
                            placeholder={getLangText('The size of the file in MB or the duration of the movie')}/>
                    </Property>
                    <Property
                        name='copyright'
                        label={getLangText('Copyright')}
                        hidden={this.props.disabled && !this.props.piece.extra_data.copyright}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={this.props.piece.extra_data.copyright}
                            placeholder={getLangText('Which copyright is attached to this work?')}/>
                    </Property>
                    <Property
                        name='courtesy_of'
                        label={getLangText('Courtesy of')}
                        hidden={this.props.disabled && !this.props.piece.extra_data.courtesy_of}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={this.props.piece.extra_data.courtesy_of}
                            placeholder={getLangText('The current owner of the artwork')}/>
                    </Property>
                    <Property
                        name='copyright_of_photography'
                        label={getLangText('Copyright of Photography')}
                        hidden={this.props.disabled && !this.props.piece.extra_data.copyright_of_photography}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={this.props.piece.extra_data.copyright_of_photography}
                            placeholder={getLangText('Who should be attributed for the photography?')}/>
                    </Property>
                    <Property
                        name='additional_details'
                        label={getLangText('Additional Details about the artwork')}
                        hidden={this.props.disabled && !this.props.piece.extra_data.additional_details}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={this.props.piece.extra_data.additional_details}
                            placeholder={getLangText('Insert artwork overview')}/>
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

export default IkonotvArtworkDetailsForm;