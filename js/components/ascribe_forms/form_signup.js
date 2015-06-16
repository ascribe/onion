'use strict';

import React from 'react';

import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import InputCheckbox from './input_checkbox';
import ButtonSubmitOrClose from '../ascribe_buttons/button_submit_close';

let SignupForm = React.createClass({
    mixins: [FormMixin],

    url() {
        return apiUrls.users_signup;
    },
    
    getFormData() {
        return {
            email: this.refs.email.state.value,
            password: this.refs.password.state.value,
            password_confirm: this.refs.password_confirm.state.value,
            terms: this.refs.terms.state.value,
            promo_code: this.refs.promo_code.state.value
        };
    },

    renderForm() {
        return (
            <form id="signup_modal_content" role="form" onSubmit={this.submit}>
                <input className="invisible" type="email" name="fake_consignee"/>
                <input className="invisible" type="password" name="fake_password"/>
                <InputText
                    ref="email"
                    placeHolder="Email"
                    required="required"
                    type="email"
                    submitted={this.state.submitted}/>
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
                <div>
                    Your password must be at least 10 characters.
                    This password is securing your digital property like a bank account.
                    Store it in a safe place!
                </div>
                <InputCheckbox
                    ref="terms"
                    required="required"
                    label={
                        <div>
                            I agree to the&nbsp;
                            <a href="/terms" target="_blank"> Terms of Service</a>
                        </div>}/>
                <InputText
                    ref="promo_code"
                    placeHolder="Promocode (Optional)"
                    required=""
                    type="text"
                    submitted={this.state.submitted}/>
                <ButtonSubmitOrClose
                    text="JOIN US"
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default SignupForm;