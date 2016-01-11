'use strict';

import React from 'react';
import { Link } from 'react-router';

import LoginForm from './ascribe_forms/form_login';

import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


let LoginContainer = React.createClass({
    propTypes: {
        // Provided from AscribeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    render() {
        setDocumentTitle(getLangText('Log in'));

        return (
            <div className="ascribe-login-wrapper">
                <LoginForm location={this.props.location} />
                <div className="ascribe-login-text">
                    {getLangText('Not an ascribe user')}&#63; <Link to="/signup">{getLangText('Sign up')}...</Link><br/>
                    {getLangText('Forgot my password')}&#63; <Link to="/password_reset">{getLangText('Rescue me')}...</Link>
                </div>
            </div>
        );
    }
});



export default LoginContainer;
