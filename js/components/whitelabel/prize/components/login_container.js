'use strict';

import React from 'react';
import Router from 'react-router';

import LoginForm from '../../../ascribe_forms/form_login';

let Link = Router.Link;


let LoginContainer = React.createClass({
    render() {
        return (
            <div className="ascribe-login-wrapper">
                <LoginForm headerMessage="Log in" />
                <div className="ascribe-login-text">
                    I'm not a user <Link to="signup">Sign up...</Link><br/>
                    I forgot my password <Link to="password_reset">Rescue me...</Link>
                </div>
            </div>
        );
    }
});



export default LoginContainer;
