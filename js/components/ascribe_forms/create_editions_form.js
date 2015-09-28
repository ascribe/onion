'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import ApiUrls from '../../constants/api_urls';

import { getLangText } from '../../utils/lang_utils';

let CreateEditionsForm = React.createClass({
    propTypes: {
        handleSuccess: React.PropTypes.func,
        pieceId: React.PropTypes.number
    },

    getFormData(){
        return {
            piece_id: parseInt(this.props.pieceId, 10)
        };
    },

    handleSuccess(response) {
        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        if(this.props.handleSuccess) {
            this.props.handleSuccess(response);
        }
    },

    render() {
        return (
            <Form
                ref='form'
                url={ApiUrls.editions}
                getFormData={this.getFormData}
                handleSuccess={this.handleSuccess}
                buttons={
                    <button
                        type="submit"
                        className="btn ascribe-btn ascribe-btn-login">
                        {getLangText('Create editions')}
                    </button>}
                spinner={
                    <button className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                    </button>
                    }>
                <Property
                    name='num_editions'
                    label={getLangText('Number of editions')}>
                    <input
                        type="number"
                        placeholder="(e.g. 32)"
                        min={1}/>
                </Property>
            </Form>
        );
    }
});

export default CreateEditionsForm;