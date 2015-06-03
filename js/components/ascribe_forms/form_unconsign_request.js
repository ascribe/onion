import fetch from 'isomorphic-fetch';

import React from 'react';

import ApiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import InputTextArea from './input_textarea';
import ButtonSubmitOrClose from '../ascribe_buttons/button_submit_close';

let UnConsignRequestForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return ApiUrls.ownership_unconsigns_request
    },
    getFormData() {
        return {
            bitcoin_id: this.props.edition.bitcoin_id,
            unconsign_request_message: this.refs.unconsign_request_message.state.value
        }
    },
    renderForm() {
        let title = this.props.edition.title;
        let username = this.props.currentUser.username;
        let message =
`Hi,

I request you to un-consign \" ${title} \".

Truly yours,
${username}`;

        return (
            <form id="unconsign_request_modal_content" role="form" onSubmit={this.submit}>
                <InputTextArea
                    ref="unconsign_request_message"
                    defaultValue={message}
                    required="" />
                <ButtonSubmitOrClose
                    text="UNCONSIGN REQUEST"
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default UnConsignRequestForm;