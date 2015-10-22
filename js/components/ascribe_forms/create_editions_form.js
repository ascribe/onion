'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import AscribeSpinner from '../ascribe_spinner';
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
                        className="btn btn-default btn-wide">
                        {getLangText('Create editions')}
                    </button>}
                spinner={
                    <button className="btn btn-default btn-wide btn-spinner">
                        <AscribeSpinner color="dark-blue" size="md" />
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