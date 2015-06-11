'use strict';

import React from 'react';

import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import ButtonSubmitOrClose from '../ascribe_buttons/button_submit_close';

let PasswordResetRequestForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return apiUrls.users_password_reset_request;
    },
    
    getFormData() {
        return {
            email: this.refs.email.state.value
        };
    },

    renderForm() {
        return (
            <form id="request_reset_password_modal_content" role="form" onSubmit={this.submit}>
                <InputText
                    ref="email"
                    placeHolder="Email"
                    required="required"
                    type="email"
                    submitted={this.state.submitted}/>
                <ButtonSubmitOrClose
                    text="RESET PASSWORD"
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default PasswordResetRequestForm;