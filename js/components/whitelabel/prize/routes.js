'use strict';

import React from 'react';
import Router from 'react-router';

import Landing from './components/landing';
import LoginContainer from './components/login_container';
import SignupContainer from './components/signup_container';
import PasswordResetContainer from '../../../components/password_reset_container';

import App from './app';
import AppConstants from '../../../constants/application_constants';

let Route = Router.Route;
let baseUrl = AppConstants.baseUrl;


function getRoutes(commonRoutes) {
    return (
        <Route name="app" path={baseUrl} handler={App}>
            <Route name="landing" path="/" handler={Landing} />
            <Route name="login" path="login" handler={LoginContainer} />
            <Route name="signup" path="signup" handler={SignupContainer} />
            <Route name="password_reset" path="password_reset" handler={PasswordResetContainer} />
        </Route>
    );
}


export default getRoutes;
