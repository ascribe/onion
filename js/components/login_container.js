'use strict';

import React from 'react';
import { Link } from 'react-router';

import LoginForm from './ascribe_forms/form_login';

import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


let LoginContainer = React.createClass({
    propTypes: {
        message: React.PropTypes.string,
        redirectOnLoggedIn: React.PropTypes.bool,
        redirectOnLoginSuccess: React.PropTypes.bool,
        onLogin: React.PropTypes.func,
        location: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            message: getLangText('Enter') + ' ascribe',
            redirectOnLoggedIn: true,
            redirectOnLoginSuccess: true
        };
    },

    render() {
        setDocumentTitle(getLangText('Log in'));

        return (
            <div className="ascribe-login-wrapper">
                <LoginForm
                    redirectOnLoggedIn={this.props.redirectOnLoggedIn}
                    redirectOnLoginSuccess={this.props.redirectOnLoginSuccess}
                    message={this.props.message}
                    onLogin={this.props.onLogin}
                    location={this.props.location}/>
            </div>
        );
    }
});



export default LoginContainer;
