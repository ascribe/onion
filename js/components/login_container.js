'use strict';

import React from 'react';
import Link from 'react-router/es6/Link';

import LoginForm from './ascribe_forms/form_login';

import withContext from './context/with_context';
import { whitelabelShape } from './prop_types';

import { setDocumentTitle } from '../utils/dom';
import { getLangText } from '../utils/lang';


let LoginContainer = React.createClass({
    propTypes: {
        // Injected through HOCs
        whitelabel: whitelabelShape.isRequired
    },

    render() {
        const { whitelabel: { name: whitelabelName } } = this.props;

        setDocumentTitle(getLangText('Log in'));

        return (
            <div className="ascribe-login-wrapper">
                <LoginForm whitelabelName={whitelabelName} />
                <div className="ascribe-login-text">
                    {getLangText(`Not a ${whitelabelName || 'ascribe'} user`)}&#63; <Link to="/signup">{getLangText('Sign up')}...</Link><br/>
                    {getLangText('Forgot my password')}&#63; <Link to="/password_reset">{getLangText('Rescue me')}...</Link>
                </div>
            </div>
        );
    }
});

export default withContext(LoginContainer, 'whitelabel');
