'use strict';

import React from 'react';
import Router from 'react-router';
import promise from 'es6-promise';

promise.polyfill();
import fetch from 'isomorphic-fetch';
//require('isomorphic-fetch');

import ApiUrls from './constants/api_urls';
import routes from './routes';
import requests from './utils/requests';

let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

requests.defaults({
    urlMap: ApiUrls,
    http: {
        headers: headers,
        credentials: 'include'
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
