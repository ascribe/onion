'use strict';

import React from 'react';
import Router from 'react-router';

import SignupForm from './ascribe_forms/form_signup';

import { getLangText } from '../utils/lang_utils';

let Link = Router.Link;

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
                <SignupForm handleSuccess={this.handleSuccess} />
                <div className="ascribe-login-text">
                    {getLangText('Already an ascribe user')}&#63; <Link to="login">{getLangText('Log in')}...</Link><br/>
                </div>
            </div>
        );
    }
});


export default SignupContainer;
