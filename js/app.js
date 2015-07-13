'use strict';

require('babel/polyfill');

import React from 'react';
import Router from 'react-router';

import fetch from 'isomorphic-fetch';

import ApiUrls from './constants/api_urls';
import constants from './constants/application_constants';
import getRoutes from './routes';
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


class AppGateway {

    start() {
        console.log('start');
        let subdomain = window.location.host.split('.')[0];
        requests.get('whitelabel_settings', {'subdomain': subdomain})
            .then(this.loadSubdomain.bind(this))
            .catch(this.loadDefault.bind(this));
    }

    loadSubdomain(data) {
        let settings = data.whitelabel;
        constants.whitelabel = settings;
        this.load('prize');
    }

    loadDefault(error) {
        console.log('Loading default app, error'. error);
        this.load('default');
    }

    load(type) {
        console.log('loading', type);
        Router.run(getRoutes(type), Router.HistoryLocation, (App) => {
            React.render(
                <App />,
                document.getElementById('main')
            );
        });
    }
}

let ag = new AppGateway();
ag.start();
