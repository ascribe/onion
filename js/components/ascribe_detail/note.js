'use strict';

import React from 'react';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';
import InputTextAreaToggable from '../ascribe_forms/input_textarea_toggable';

import withContext from '../context/with_context';

import { getLangText } from '../../utils/lang_utils';

let Note = React.createClass({
    propTypes: {
        id: React.PropTypes.func.isRequired,
        url: React.PropTypes.string.isRequired,

        defaultValue: React.PropTypes.string,
        editable: React.PropTypes.bool,
        label: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        show: React.PropTypes.bool,
        successMessage: React.PropTypes.string,

        // Injected through HOCs
        isLoggedIn: React.PropTypes.bool.isRequired // eslint-disable-line react/sort-prop-types
    },

    getDefaultProps() {
        return {
            editable: true,
            placeholder: getLangText('Enter a note'),
            show: true,
            successMessage: getLangText('Note saved')
        };
    },

    showNotification() {
        const notification = new GlobalNotificationModel(this.props.successMessage, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        const {
            defaultValue,
            editable,
            id,
            isLoggedIn,
            label,
            placeholder,
            show,
            url
        } = this.props;

        if ((isLoggedIn && editable || !editable) && show) {
            return (
                <Form
                    url={url}
                    getFormData={id}
                    handleSuccess={this.showNotification}
                    disabled={!editable}>
                    <Property
                        name='note'
                        label={label}>
                        <InputTextAreaToggable
                            rows={1}
                            defaultValue={defaultValue}
                            placeholder={placeholder} />
                    </Property>
                    <hr />
                </Form>
            );
        } else {
            return null;
        }
    }
});

export default withContext(Note, 'isLoggedIn');
