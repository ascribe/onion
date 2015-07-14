'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';

import AppConstants from '../../constants/application_constants';
import { getLangText } from '../../utils/lang_utils.js';


let UnConsignForm = React.createClass({
    propTypes: {
        url: React.PropTypes.string,
        id: React.PropTypes.object,
        message: React.PropTypes.string,
        editions: React.PropTypes.array,
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
                                type="submit">{getLangText('UNCONSIGN')}</Button>
                            <Button
                                className="btn btn-danger btn-delete btn-sm ascribe-margin-1px"
                                style={{marginLeft: '0'}}
                                onClick={this.props.onRequestHide}>{getLangText('CLOSE')}</Button>
                        </p>
                    </div>}
                spinner={
                    <div className="modal-footer">
                        <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_small.gif'} />
                    </div>}>
                <Property
                    name='unconsign_message'
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
            </Form>
        );
    }
});

export default UnConsignForm;