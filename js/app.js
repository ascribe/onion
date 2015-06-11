'use strict';

import React from 'react';
import Router from 'react-router';
import promise from 'es6-promise';

promise.polyfill();

import ApiUrls from './constants/api_urls';
import routes from './routes';
import fetch from './utils/fetch';

let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

//if (window.DEBUG) {
//    headers.Authorization = 'Basic ' + window.CREDENTIALS;
//}

fetch.defaults({
    urlMap: ApiUrls,
    http: {
        headers: headers,
        credentials: 'cors'
    },
    fatalErrorHandler: (err) => {
        console.log(err);
        //alert('Something went wrong, please reload the page');
    }
});

Router.run(routes, Router.HistoryLocation, (AscribeApp) => {
    React.render(
        <AscribeApp />,
        document.getElementById('main')
    );
});
