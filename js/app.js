'use strict';

import React from 'react';
import Router from 'react-router';
import promise from 'es6-promise';

promise.polyfill();

import AppConstants from './constants/application_constants';
import ApiUrls from './constants/api_urls';
import routes from './routes';
import fetch from './utils/fetch';

/*
    Taken from
    http://stackoverflow.com/questions/30613447/how-to-debug-reactjss-setstate?noredirect=1#comment49301874_30613447

    <remove this in production>

*/

var warn = console.warn;
console.warn = function(warning) {
  if (/(setState)/.test(warning)) {
    throw new Error(warning);
  }
  warn.apply(console, arguments);
};

/*
    </remove this in production>

 */

fetch.defaults({
    urlMap: ApiUrls,
    http: {
        headers: {
            'Authorization': 'Basic ' + AppConstants.debugCredentialBase64,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
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
