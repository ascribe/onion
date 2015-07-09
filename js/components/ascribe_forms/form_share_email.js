'use strict';

import React from 'react';

import ApiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import InputTextArea from './input_textarea';
import ButtonSubmitOrClose from '../ascribe_buttons/button_submit_close';
import { getLangText } from '../../utils/lang_utils.js'


let ShareForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return ApiUrls.ownership_shares;
    },

    getFormData() {
        return {
            bitcoin_id: this.getBitcoinIds().join(),
            share_emails: this.refs.share_emails.state.value,
            share_message: this.refs.share_message.state.value
        };
    },

    renderForm() {
        let title = this.getTitlesString().join('');
        let username = this.props.currentUser.username;
        let message =
`${getLangText('Hi')},

${getLangText('I am sharing')} :
${title}${getLangText('with you')}.

${getLangText('Truly yours')},
${username}`;

        return (
            <form id="share_modal_content" role="form" key="share_modal_content" onSubmit={this.submit}>
                <InputText
                    ref="share_emails"
                    placeHolder={getLangText('Comma separated emails')}
                    required="required"
                    type="text"
                    submitted={this.state.submitted}/>
                <InputTextArea
                    ref="share_message"
                    defaultValue={message}
                    required=""
                    />
                <ButtonSubmitOrClose
                    text={getLangText('SHARE')}
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default ShareForm;