'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';

import AscribeSpinner from '../ascribe_spinner';
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
                buttons={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <Button
                                className="btn btn-default btn-sm ascribe-margin-1px"
                                type="submit">
                                {getLangText('REQUEST UNCONSIGN')}
                            </Button>
                        </p>
                    </div>}
                spinner={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <AscribeSpinner color='dark-blue' size='md'/>
                        </p>
                    </div>}>
                <Property
                    name='unconsign_request_message'
                    label={getLangText('Personal Message')}
                    editable={true}
                    overrideForm={true}>
                    <InputTextAreaToggable
                        rows={1}
                        defaultValue={this.props.message}
                        placeholder={getLangText('Enter a message...')}
                        required />
                </Property>
                <hr />
            </Form>
        );
    }
});

export default UnConsignRequestForm;
