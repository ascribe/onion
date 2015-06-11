'use strict';

import React from 'react';

import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import ButtonSubmitOrClose from '../ascribe_buttons/button_submit_close';

let PasswordResetForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return apiUrls.users_password_reset;
    },
    
    getFormData() {
        return {
            email: this.props.email,
            token: this.props.token,
            password: this.refs.password.state.value,
            password_confirm: this.refs.password_confirm.state.value
        };
    },

    renderForm() {
        return (
            <form id="reset_password_modal_content" role="form" onSubmit={this.submit}>
                <div>Reset the password for {this.props.email}:</div>
                <InputText
                    ref="password"
                    placeHolder="Choose a password"
                    required="required"
                    type="password"
                    submitted={this.state.submitted}/>
                <InputText
                    ref="password_confirm"
                    placeHolder="Confirm password"
                    required="required"
                    type="password"
                    submitted={this.state.submitted}/>
                <ButtonSubmitOrClose
                    text="RESET PASSWORD"
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default PasswordResetForm;