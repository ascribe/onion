'use strict';

import React from 'react';



import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';
import Button from 'react-bootstrap/lib/Button';

import AppConstants from '../../constants/application_constants';
import { getLangText } from '../../utils/lang_utils.js';


let ShareForm = React.createClass({
    propTypes: {
        url: React.PropTypes.string,
        id: React.PropTypes.string,
        message: React.PropTypes.string,
        editions: React.PropTypes.array,
        currentUser: React.PropTypes.object,
        onRequestHide: React.PropTypes.func,
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
                                type="submit">SHARE</Button>
                            <Button
                                className="btn btn-danger btn-delete btn-sm ascribe-margin-1px"
                                style={{marginLeft: '0'}}
                                onClick={this.props.onRequestHide}>CLOSE</Button>
                        </p>
                    </div>}
                spinner={
                    <div className="modal-footer">
                        <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_small.gif'} />
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
                    editable={true}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        defaultValue={this.props.message}
                        placeholder={getLangText('Enter a message...')}
                        required="required"/>
                </Property>
            </Form>
        );
    }
});

export default ShareForm;