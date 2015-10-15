'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';

import AppConstants from '../../constants/application_constants';
import { getLangText } from '../../utils/lang_utils.js';
import AclInformation from '../ascribe_buttons/acl_information';

let ConsignForm = React.createClass({
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
                                {getLangText('CONSIGN')}
                            </Button>
                        </p>
                    </div>}
                spinner={
                    <div className="modal-footer">
                        <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_small.gif'} />
                    </div>}>
                <AclInformation aim={'form'} verbs={['acl_consign']}/>
                <Property
                    name='consignee'
                    label={getLangText('Email')}>
                    <input
                        type="email"
                        placeholder={getLangText('Email of the consignee')}
                        required/>
                </Property>
                <Property
                    name='consign_message'
                    label={getLangText('Personal Message')}
                    editable={true}
                    overrideForm={true}>
                    <InputTextAreaToggable
                        rows={1}
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

export default ConsignForm;