'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Alert from 'react-bootstrap/lib/Alert';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';

import AclInformation from '../ascribe_buttons/acl_information';

import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils.js';


let TransferForm = React.createClass({
    propTypes: {
        id: React.PropTypes.object.isRequired,
        url: React.PropTypes.string.isRequired,

        handleSuccess: React.PropTypes.func,
        message: React.PropTypes.string
    },

    getFormData() {
        return this.props.id;
    },

    render() {
        const { handleSuccess, message, url } = this.props;

        return (
            <Form
                ref='form'
                url={url}
                getFormData={this.getFormData}
                handleSuccess={handleSuccess}
                buttons={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <Button
                                className="btn btn-default btn-sm ascribe-margin-1px"
                                type="submit">
                                {getLangText('TRANSFER')}
                            </Button>
                        </p>
                    </div>}
                spinner={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <AscribeSpinner color='dark-blue' size='md'/>
                        </p>
                    </div>}>
                <AclInformation aim={'form'} verbs={['acl_transfer']}/>
                <Property
                    name='transferee'
                    label={getLangText('Email')}>
                    <input
                        type="email"
                        placeholder={getLangText('Email of the transferee')}
						value={getLangText('Admin email')}
                        required/>
                </Property>
                <Property
                    name='transfer_message'
                    label={getLangText('Personal Message')}
                    editable={true}
                    overrideForm={true}>
                    <InputTextAreaToggable
                        rows={1}
                        defaultValue={message}
                        placeholder={getLangText('Enter a message...')}
                        required />
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
