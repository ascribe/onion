'use strict';

import React from 'react';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';

import Button from 'react-bootstrap/lib/Button';

import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang_utils.js';


let ShareForm = React.createClass({
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
                buttons={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <Button
                                className="btn btn-default btn-sm ascribe-margin-1px"
                                type="submit">
                                SHARE
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
                    name='share_emails'
                    label={getLangText('Emails')}>
                    <input
                        type="text"
                        placeholder={getLangText('Comma separated emails')}
                        required/>
                </Property>
                <Property
                    name='share_message'
                    label='Personal Message'
                    editable={true}
                    overrideForm={true}>
                    <InputTextAreaToggable
                        rows={1}
                        defaultValue={this.props.message}
                        placeholder={getLangText('Enter a message...')}
                        required="required"/>
                </Property>
            </Form>
        );
    }
});

export default ShareForm;