//'use strict';
//
//import React from 'react';
//
//import ApiUrls from '../../constants/api_urls';
//import FormMixin from '../../mixins/form_mixin';
//import InputText from './input_text';
//import InputTextArea from './input_textarea';
//import ButtonSubmitOrClose from '../ascribe_buttons/button_submit_close';
//import { getLangText } from '../../utils/lang_utils.js'
//
//let TransferForm = React.createClass({
//    mixins: [FormMixin],
//
//    url() {
//        return ApiUrls.ownership_transfers;
//    },
//
//    getFormData() {
//        return {
//            bitcoin_id: this.getBitcoinIds().join(),
//            transferee: this.refs.transferee.state.value,
//            transfer_message: this.refs.transfer_message.state.value,
//            password: this.refs.password.state.value
//        };
//    },
//
//    renderForm() {
//        let title = this.getTitlesString().join('');
//        let username = this.props.currentUser.username;
//        let message =
//`${getLangText('Hi')},
//
//${getLangText('I transfer ownership of')} :
//${title}${getLangText('to you')}.
//
//${getLangText('Truly yours')},
//${username}`;
//
//        return (
//            <form id="transfer_modal_content" role="form" onSubmit={this.submit}>
//                <input className="invisible" type="email" name="fake_transferee"/>
//                <input className="invisible" type="password" name="fake_password"/>
//                <InputText
//                    ref="transferee"
//                    placeHolder={getLangText('Transferee email')}
//                    required="required"
//                    type="email"
//                    submitted={this.state.submitted}/>
//                <InputTextArea
//                    ref="transfer_message"
//                    defaultValue={message}
//                    required=""
//                    />
//                <InputText
//                    ref="password"
//                    placeHolder={getLangText('Password')}
//                    required="required"
//                    type="password"
//                    submitted={this.state.submitted}/>
//                <div>
//                    Make sure that display instructions and technology details are correct.
//                    They cannot be edited after the transfer.
//                </div>
//               <ButtonSubmitOrClose
//                    text={getLangText('TRANSFER')}
//                    onClose={this.props.onRequestHide}
//                    submitted={this.state.submitted} />
//            </form>
//        );
//    }
//});
//
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
                                type="submit">{getLangText('TRANSFER')}</Button>
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