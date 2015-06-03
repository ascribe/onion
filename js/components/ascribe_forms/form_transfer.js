import fetch from 'isomorphic-fetch';

import React from 'react';

import ApiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import InputTextArea from './input_textarea';
import ButtonSubmitOrClose from '../ascribe_buttons/button_submit_close';



let TransferForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return ApiUrls.ownership_transfers
    },
    getFormData() {
        return {
            bitcoin_id: this.getBitcoinIds().join(),
            transferee: this.refs.transferee.state.value,
            transfer_message: this.refs.transfer_message.state.value,
            password: this.refs.password.state.value
        }
    },
    renderForm() {
        let title = this.getTitlesString().join("");
        let username = this.props.currentUser.username;
        let message =
`Hi,

I transfer ownership of :
${title}to you.

Truly yours,
${username}`;

        return (
            <form id="transfer_modal_content" role="form" onSubmit={this.submit}>
                <input className="invisible" type="email" name="fake_transferee"/>
                <input className="invisible" type="password" name="fake_password"/>
                <InputText
                    ref="transferee"
                    placeHolder="Transferee email"
                    required="required"
                    type="email"
                    submitted={this.state.submitted}/>
                <InputTextArea
                    ref="transfer_message"
                    defaultValue={message}
                    required=""
                    />
                <InputText
                    ref="password"
                    placeHolder="Password"
                    required="required"
                    type="password"
                    submitted={this.state.submitted}/>
                <div>
                    Make sure that display instructions and technology details are correct.
                    They cannot be edited after the transfer.
                </div>
               <ButtonSubmitOrClose
                    text="TRANSFER"
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default TransferForm;