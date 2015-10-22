'use strict';

import React from 'react';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import ApiUrls from '../../../../../../constants/api_urls';
import AppConstants from '../../../../../../constants/application_constants';

import requests from '../../../../../../utils/requests';

import { getLangText } from '../../../../../../utils/lang_utils';


let LumenusAdditionalDataForm = React.createClass({
    propTypes: {
        handleSuccess: React.PropTypes.func,
        piece: React.PropTypes.object.isRequired,
        isInline: React.PropTypes.bool,
        location: React.PropTypes.object
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

    render() {
        let { piece, isInline, handleSuccess } = this.props;
        let buttons, spinner, heading;

        if(!isInline) {
            buttons = (
                <button
                    type="submit"
                    className="btn ascribe-btn ascribe-btn-login">
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

        if(piece && piece.id) {
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
                    <Property
                        name='dummy_field'
                        label={getLangText('Dummy Field')}>
                        <input
                            type="text"
                            placeholder="Your awesome field here!"
                            required/>
                    </Property>
                    <Property
                        name='dummy_field'
                        label={getLangText('Dummy Field')}>
                        <input
                            type="text"
                            placeholder="Or here!"
                            required/>
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
