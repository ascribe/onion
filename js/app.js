'use strict';

require("babel/polyfill");

import React from 'react';
import Router from 'react-router';

import fetch from 'isomorphic-fetch';

import ApiUrls from './constants/api_urls';
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
        let subdomain = window.location.host.split('.')[0];
        requests.get('whitelabel_settings', {'subdomain': subdomain})
            .then(this.loadSubdomain.bind(this))
            .catch(this.loadDefault.bind(this));
    }

    loadSubdomain(data) {
        let settings = data.whitelabel;

        this.load('prize');
    }

    loadDefault() {
        this.load('default');
    }

    load(type) {
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
