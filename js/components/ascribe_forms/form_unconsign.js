'use strict';

import React from 'react';

import ApiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import InputTextArea from './input_textarea';
import ButtonSubmitOrClose from '../ascribe_buttons/button_submit_close';

let UnConsignForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return ApiUrls.ownership_unconsigns;
    },

    getFormData() {
        return {
            bitcoin_id: this.getBitcoinIds().join(),
            unconsign_message: this.refs.unconsign_message.state.value,
            password: this.refs.password.state.value
        };
    },

    renderForm() {
        let title = this.getTitlesString().join('');
        let username = this.props.currentUser.username;
        let message =
`Hi,

I un-consign:
${title}from you.

Truly yours,
${username}`;

        return (
            <form id="unconsign_modal_content" role="form" onSubmit={this.submit}>
                <input className="invisible" type="email" name="fake_unconsignee"/>
                <input className="invisible" type="password" name="fake_password"/>
                <InputTextArea
                    ref="unconsign_message"
                    defaultValue={message}
                    required="" />
                <InputText
                    ref="password"
                    placeHolder="Password"
                    required="required"
                    type="password"
                    submitted={this.state.submitted} />
               <ButtonSubmitOrClose
                    text="UNCONSIGN"
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default UnConsignForm;