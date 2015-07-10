'use strict';

import React from 'react';
import Router from 'react-router';

import Landing from './components/landing';

import App from './app';
import AppConstants from '../../../constants/application_constants';

let Route = Router.Route;
// let Redirect = Router.Redirect;
let baseUrl = AppConstants.baseUrl;


function getRoutes(commonRoutes) {
    return (
        <Route name="app" path={baseUrl} handler={App}>
            <Route name="landing" path="/" handler={Landing} />
            {commonRoutes}
        </Route>
    );
}


export default getRoutes;
