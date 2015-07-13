'use strict';

import React from 'react';
import Router from 'react-router';

import LoginForm from './ascribe_forms/form_login';

import { getLangText } from '../utils/lang_utils';

let Link = Router.Link;


let LoginContainer = React.createClass({
    propTypes: {
        message: React.PropTypes.string,
        redirectOnLoggedIn: React.PropTypes.bool,
        redirectOnLoginSuccess: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            message: getLangText('Enter') + ' ascribe',
            redirectOnLoggedIn: true,
            redirectOnLoginSuccess: true
        };
    },

    render() {
        return (
            <div className="ascribe-login-wrapper">
                <LoginForm
                    redirectOnLoggedIn={this.props.redirectOnLoggedIn}
                    redirectOnLoginSuccess={this.props.redirectOnLoginSuccess}
                    message={this.props.message} />
                <div className="ascribe-login-text">
                    {getLangText('Not an ascribe user')}&#63; <Link to="signup">{getLangText('Sign up')}...</Link><br/>
                    {getLangText('Forgot my password')}&#63; <Link to="password_reset">{getLangText('Rescue me')}...</Link>
                </div>
            </div>
        );
    }
});



export default LoginContainer;
