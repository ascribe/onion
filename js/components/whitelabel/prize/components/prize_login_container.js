'use strict';

import React from 'react';
import { Link } from 'react-router';

import LoginForm from '../../../ascribe_forms/form_login';

import { getLangText } from '../../../../utils/lang_utils';


let LoginContainer = React.createClass({
    render() {
        return (
            <div className="ascribe-login-wrapper">
                <LoginForm
                    headerMessage={getLangText('Log in with ascribe')} />
                <div
                    className="ascribe-login-text">
                    {getLangText('I\'m not a user') + ' '}
                    <Link to="/signup">{getLangText('Sign up...')}</Link>
                    <br/>

                    {getLangText('I forgot my password') + ' '}
                    <Link to="/password_reset">{getLangText('Rescue me...')}</Link>
                </div>
            </div>
        );
    }
});



export default LoginContainer;
