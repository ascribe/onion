'use strict';

import React from 'react';

import apiUrls from '../../constants/api_urls';
import FormMixin from '../../mixins/form_mixin';
import InputText from './input_text';
import ButtonSubmitOrClose from '../ascribe_buttons/button_submit_close';

import SignupModal from '../ascribe_modal/modal_signup';
import PasswordResetRequestModal from '../ascribe_modal/modal_password_request_reset';
import { getLangText } from '../../utils/lang_utils.js'

let LoginForm = React.createClass({
    mixins: [FormMixin],


    url() {
        return apiUrls.users_login;
    },
    
    getFormData() {
        return {
            email: this.refs.email.state.value,
            password: this.refs.password.state.value
        };
    },
    renderForm() {
        return (
            <form id="login_modal_content" role="form" onSubmit={this.submit}>
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
                    placeHolder={getLangText('Password')}
                    required="required"
                    type="password"
                    submitted={this.state.submitted}/>
                <div>
                    {getLangText('Forgot your password')}&#63;
                    <PasswordResetRequestModal
                        button={<a className="button" href="#"> {getLangText('Reset password')}</a>}/>
                </div>
                <div>
                    {getLangText('Not a member yet')}&#63;
                    <SignupModal
                        button={<a className="button" href="#"> {getLangText('Sign up')}</a>}/>
                </div>
                <ButtonSubmitOrClose
                    text={getLangText('LOGIN')}
                    onClose={this.props.onRequestHide}
                    submitted={this.state.submitted} />
            </form>
        );
    }
});

export default LoginForm;
