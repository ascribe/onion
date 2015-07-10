'use strict';

import React from 'react';
import Router from 'react-router';

import App from './ascribe_app';
import AppConstants from '../constants/application_constants';

let Route = Router.Route;
let Redirect = Router.Redirect;
let baseUrl = AppConstants.baseUrl;


function getRoutes(commonRoutes) {
    return (
        <Route name="app" path={baseUrl} handler={App}>
            <Redirect from={baseUrl} to="login" />
            <Redirect from={baseUrl + '/'} to="login" />
            {commonRoutes}
        </Route>
    );
}


export default getRoutes;
