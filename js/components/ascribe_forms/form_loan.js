import fetch from 'isomorphic-fetch';

import React from 'react';

import ApiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import InputTextArea from './input_textarea';
import ButtonSubmitOrClose from './button_submit_close';

let ConsignForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return ApiUrls.ownership_consigns
    },
    getFormData() {
        return {
            bitcoin_id: this.props.edition.bitcoin_id,
            consignee: this.refs.consignee.state.value,
            consign_message: this.refs.consign_message.state.value,
            password: this.refs.password.state.value
        }
    },
    renderForm() {
        let title = this.props.edition.title;
        let username = this.props.currentUser.username;
        let message =
`Hi,

I consign \" ${title} \" to you.

Truly yours,
${username}`;

        return (
            <form id="consign_modal_content" role="form" onSubmit={this.submit}>
                <input className="invisible" type="email" name="fake_consignee"/>
                <input className="invisible" type="password" name="fake_password"/>
                <InputText
                    ref="consignee"
                    placeHolder="Consignee email"
                    required="required"
                    type="email"
                    submitted={this.state.submitted}/>
                <InputTextArea
                    ref="consign_message"
                    defaultValue={message}
                    required=""
                    />
                <InputText
                    ref="password"
                    placeHolder="Password"
                    required="required"
                    type="password"
                    submitted={this.state.submitted}/>
               <ButtonSubmitOrClose
                    text="CONSIGN"
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default ConsignForm;