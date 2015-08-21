'use strict';

import React from 'react';

import Form from './../ascribe_forms/form';
import Property from './../ascribe_forms/property';
import InputTextAreaToggable from './../ascribe_forms/input_textarea_toggable';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import { getLangText } from '../../utils/lang_utils';

let Note = React.createClass({
    propTypes: {
        url: React.PropTypes.string,
        id: React.PropTypes.func,
        label: React.PropTypes.string,
        currentUser: React.PropTypes.object,
        defaultValue: React.PropTypes.string,
        editable: React.PropTypes.bool,
        show: React.PropTypes.bool,
        placeholder: React.PropTypes.string,
        successMessage: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            editable: true,
            show: true,
            placeholder: 'Enter a note',
            successMessage: 'Note saved'
        };
    },

    showNotification(){
        let notification = new GlobalNotificationModel(this.props.successMessage, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        if ((this.props.currentUser.username && true || false) && this.props.show) {
            return (
                <Form
                    url={this.props.url}
                    getFormData={this.props.id}
                    handleSuccess={this.showNotification}>
                    <Property
                        name='note'
                        label={this.props.label}
                        editable={this.props.editable}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={this.props.editable}
                            defaultValue={this.props.defaultValue}
                            placeholder={this.props.placeholder}/>
                    </Property>
                    <hr />
                </Form>
            );
        }
        return null;
    }
});

export default Note