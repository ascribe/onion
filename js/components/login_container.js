'use strict';

import React from 'react';
import Link from 'react-router/es6/Link';

import LoginForm from './ascribe_forms/form_login';

import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


let LoginContainer = React.createClass({
    propTypes: {
        // Provided from AscribeApp
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    render() {
        const { whitelabel: { name: whitelabelName },
                location } = this.props;

        setDocumentTitle(getLangText('Log in'));

        return (
            <div className="ascribe-login-wrapper">
                <LoginForm
                    location={location}
                    whitelabelName={whitelabelName} />
                <div className="ascribe-login-text">
                    {getLangText(`Not a ${whitelabelName || 'ascribe'} user`)}&#63; <Link to="/signup">{getLangText('Sign up')}...</Link><br/>
                    {getLangText('Forgot my password')}&#63; <Link to="/password_reset">{getLangText('Rescue me')}...</Link>
                </div>
            </div>
        );
    }
});



export default LoginContainer;
