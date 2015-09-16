'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Alert from 'react-bootstrap/lib/Alert';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';


import AppConstants from '../../constants/application_constants';
import { getLangText } from '../../utils/lang_utils.js';


let TransferForm = React.createClass({
    propTypes: {
        url: React.PropTypes.string,
        id: React.PropTypes.object,
        message: React.PropTypes.string,
        editions: React.PropTypes.array,
        currentUser: React.PropTypes.object,
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
                buttonSubmit={getLangText('TRANSFER')}
                buttonCancel={false}>
                <Property
                    name='transferee'
                    label={getLangText('Email')}>
                    <input
                        type="email"
                        placeholder={getLangText('Email of the transferee')}
                        required/>
                </Property>
                <Property
                    name='transfer_message'
                    label={getLangText('Personal Message')}
                    editable={true}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        defaultValue={this.props.message}
                        placeholder={getLangText('Enter a message...')}
                        required="required"/>
                </Property>
                <Property
                    name='password'
                    label={getLangText('Password')}>
                    <input
                        type="password"
                        placeholder={getLangText('Enter your password')}
                        required/>
                </Property>
                <hr />
                <br />
                <Alert bsStyle='warning'>
                    Make sure that display instructions and technology details are correct.<br/>
                    They cannot be edited after the transfer.
                </Alert>
            </Form>
        );
    }
});

export default TransferForm;
