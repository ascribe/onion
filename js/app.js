'use strict';

import React from 'react';
import Router from 'react-router';
import promise from 'es6-promise';

promise.polyfill();

import AscribeApp from './components/ascribe_app';
import AppConstants from './constants/application_constants';
import ApiUrls from './constants/api_urls';
import routes from './routes';
import alt from './alt';
import fetch from './utils/fetch';
import AlertDismissable from './components/ascribe_forms/alert';


fetch.defaults({
    urlMap: ApiUrls,
    http: {
        headers: {
            'Authorization': 'Basic ' + AppConstants.debugCredentialBase64,
            'Accept': 'application/json'
        }
    },
    fatalErrorHandler: (err) => {
        console.log(err);
        //alert('Something went wrong, please reload the page');
    }
});

Router.run(routes, Router.HashLocation, (AscribeApp) => {
    React.render(
        <AscribeApp />,
        document.getElementById('main')
    );
});
