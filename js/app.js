'use strict';

require('babel/polyfill');

import React from 'react';
import Router from 'react-router';

/* eslint-disable */
import fetch from 'isomorphic-fetch';
/* eslint-enable */

import ApiUrls from './constants/api_urls';
import { updateApiUrls } from './constants/api_urls';
import appConstants from './constants/application_constants';
import getRoutes from './routes';
import requests from './utils/requests';

import { getSubdomainSettings } from './utils/constants_utils';
import { initLogging } from './utils/error_utils';

import EventActions from './actions/event_actions';

/* eslint-disable */
// You can comment out the modules you don't need
// import DebugHandler from './third_party/debug';
import GoogleAnalyticsHandler from './third_party/ga';
import RavenHandler from './third_party/raven';
import IntercomHandler from './third_party/intercom';
import NotificationsHandler from './third_party/notifications';
/* eslint-enable */

initLogging();

let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

requests.defaults({
    urlMap: ApiUrls,
    http: {
        headers: headers,
        credentials: 'include'
    }
});


class AppGateway {
    start() {
        let settings;
        let subdomain = window.location.host.split('.')[0];

        try {
            settings = getSubdomainSettings(subdomain);
            appConstants.whitelabel = settings;
            updateApiUrls(settings.type, subdomain);
            this.load(settings);
        } catch(err) {
            // if there are no matching subdomains, we're routing
            // to the default frontend
            console.logGlobal(err);
            this.load();
        }
    }

    load(settings) {
        let type = 'default';
        let subdomain = 'www';

        if (settings) {
            type = settings.type;
            subdomain = settings.subdomain;
        }

        window.document.body.classList.add('client--' + subdomain);

        EventActions.applicationWillBoot(settings);
        window.appRouter = Router.run(getRoutes(type, subdomain), Router.HistoryLocation, (App) => {
            React.render(
                <App />,
                document.getElementById('main')
            );
            EventActions.routeDidChange();
        });
        EventActions.applicationDidBoot(settings);
    }
}

let ag = new AppGateway();
ag.start();

