'use strict';

import React from 'react';

import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import InputCheckbox from './input_checkbox';
import ButtonSubmitOrClose from '../ascribe_buttons/button_submit_close';
import { getLangText } from '../../utils/lang_utils.js'

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
                    placeHolder={getLangText('Email')}
                    required="required"
                    type="email"
                    submitted={this.state.submitted}/>
                <InputText
                    ref="password"
                    placeHolder={getLangText('Choose a password')}
                    required="required"
                    type="password"
                    submitted={this.state.submitted}/>
                <InputText
                    ref="password_confirm"
                    placeHolder={getLangText('Confirm password')}
                    required="required"
                    type="password"
                    submitted={this.state.submitted}/>
                <div>
                    {getLangText('Your password must be at least 10 characters')}.
                    {getLangText('This password is securing your digital property like a bank account')}.
                    {getLangText('Store it in a safe place')}!
                </div>
                <InputCheckbox
                    ref="terms"
                    required="required"
                    label={
                        <div>
                            {getLangText('I agree to the')}&nbsp;
                            <a href="/terms" target="_blank"> {getLangText('Terms of Service')}</a>
                        </div>}/>
                <InputText
                    ref="promo_code"
                    placeHolder={getLangText('Promocode (Optional)')}
                    required=""
                    type="text"
                    submitted={this.state.submitted}/>
                <ButtonSubmitOrClose
                    text={getLangText('JOIN US')}
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default SignupForm;