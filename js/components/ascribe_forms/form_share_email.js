import fetch from 'isomorphic-fetch';

import React from 'react';

import ApiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import InputTextArea from './input_textarea';
import ButtonSubmitOrClose from './button_submit_close';

let ShareForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return ApiUrls.ownership_shares_mail
    },
    getFormData() {
        return {
            bitcoin_id: this.props.edition.bitcoin_id,
            share_emails: this.refs.share_emails.state.value,
            share_message: this.refs.share_message.state.value
        }
    },
    renderForm() {
        let title = this.props.edition.title;
        let username = this.props.currentUser.username;
        let message =
`Hi,

I am sharing \" ${title} \" with you.

Truly yours,
${username}`;

        return (
            <form id="share_modal_content" role="form" key="share_modal_content" onSubmit={this.submit}>
                <InputText
                    ref="share_emails"
                    placeHolder="Comma separated emails"
                    required="required"
                    type="text"
                    submitted={this.state.submitted}/>
                <InputTextArea
                    ref="share_message"
                    defaultValue={message}
                    required=""
                    />
                <ButtonSubmitOrClose
                    text="SHARE"
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default ShareForm;