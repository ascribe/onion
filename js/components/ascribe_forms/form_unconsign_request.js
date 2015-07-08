'use strict';

import React from 'react';

import ApiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputTextArea from './input_textarea';
import ButtonSubmitOrClose from '../ascribe_buttons/button_submit_close';
import { getLangText } from '../../utils/lang_utils.js'

let UnConsignRequestForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return ApiUrls.ownership_unconsigns_request;
    },

    getFormData() {
        return {
            bitcoin_id: this.props.edition.bitcoin_id,
            unconsign_request_message: this.refs.unconsign_request_message.state.value
        };
    },

    renderForm() {
        let title = this.props.edition.title;
        let username = this.props.currentUser.username;
        let message =
`${getLangText('Hi')},

${getLangText('I request you to un-consign')} \" ${title} \".

${getLangText('Truly yours')},
${username}`;

        return (
            <form id="unconsign_request_modal_content" role="form" onSubmit={this.submit}>
                <InputTextArea
                    ref="unconsign_request_message"
                    defaultValue={message}
                    required="" />
                <ButtonSubmitOrClose
                    text={getLangText('UNCONSIGN REQUEST')}
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default UnConsignRequestForm;