'use strict';

import React from 'react';
import SignupForm from './ascribe_forms/form_signup';
import Property from './ascribe_forms/property';

import { getLangText } from '../utils/lang_utils';


let SignupContainer = React.createClass({
    getInitialState() {
        return {
            submitted: false,
            message: null
        };
    },

    handleSuccess(message){
        this.setState({
            submitted: true,
            message: message
        });
    },

    render() {
        if (this.state.submitted){
            return (
                <div className="ascribe-login-wrapper">
                    <br/>
                    <div className="ascribe-login-text ascribe-login-header">
                    {this.state.message}
                    </div>
                </div>
            );
        }
        return (
            <div className="ascribe-login-wrapper">
                <SignupForm>
                    <Property
                        name='promo_code'
                        label={getLangText('Promocode')}>
                        <input
                            type="text"
                            placeholder={getLangText('Enter a promocode here (Optional)')}/>
                    </Property>
                </SignupForm>
            </div>
        );
    }
});


export default SignupContainer;
