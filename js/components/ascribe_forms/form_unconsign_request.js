'use strict';

import React from 'react';
import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';
import { getLangText } from '../../utils/lang_utils.js';


let UnConsignRequestForm = React.createClass({
    propTypes: {
        url: React.PropTypes.string,
        id: React.PropTypes.object,
        message: React.PropTypes.string,
        handleSuccess: React.PropTypes.func
    },

    getFormData(){
        return this.props.id;
    },

    render() {

        return (
            <Form
                ref='form'
                url={this.props.url}
                getFormData={this.getFormData}
                handleSuccess={this.props.handleSuccess}
                buttonSubmit={getLangText('REQUEST UNCONSIGN')}>
                <Property
                    name='unconsign_request_message'
                    label={getLangText('Personal Message')}
                    editable={true}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        defaultValue={this.props.message}
                        placeholder={getLangText('Enter a message...')}
                        required="required"/>
                </Property>
                <hr />
            </Form>
        );
    }
});

export default UnConsignRequestForm;
