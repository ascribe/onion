'use strict';

import 'babel/polyfill';

import React from 'react';
import { Router, Redirect } from 'react-router';
import history from './history';

/* eslint-disable */
import fetch from 'isomorphic-fetch';
/* eslint-enable */

import ApiUrls from './constants/api_urls';

import AppConstants from './constants/application_constants';
import getRoutes from './routes';
import requests from './utils/requests';

import { updateApiUrls } from './constants/api_urls';
import { getDefaultSubdomainSettings, getSubdomainSettings } from './utils/constants_utils';
import { initLogging } from './utils/error_utils';
import { getSubdomain } from './utils/general_utils';

import EventActions from './actions/event_actions';

/* eslint-disable */
// You can comment out the modules you don't need
// import DebugHandler from './third_party/debug';
import GoogleAnalyticsHandler from './third_party/ga';
import RavenHandler from './third_party/raven';
import IntercomHandler from './third_party/intercom';
import NotificationsHandler from './third_party/notifications';
import FacebookHandler from './third_party/facebook';
/* eslint-enable */


const AppGateway = {
    start() {
        try {
            const subdomain = getSubdomain();
            const settings = getSubdomainSettings(subdomain);

            AppConstants.whitelabel = settings;
            updateApiUrls(settings.type, subdomain);
            this.load(settings);
        } catch(err) {
            // if there are no matching subdomains, we're routing
            // to the default frontend
            console.logGlobal(err);
            this.load(getDefaultSubdomainSettings());
        }
    },

    load(settings) {
        const { subdomain, type } = settings;
        let redirectRoute = (<Redirect from="/" to="/collection" />);

        if (subdomain) {
            // Some whitelabels have landing pages so we should not automatically redirect from / to /collection.
            // Only www and cc do not have a landing page.
            if (subdomain !== 'cc') {
                redirectRoute = null;
            }

            // Adds a client specific class to the body for whitelabel styling
            window.document.body.classList.add('client--' + subdomain);
        }

        // Send the applicationWillBoot event to the third-party stores
        EventActions.applicationWillBoot(settings);

        // `history.listen` is called on every route change, which is perfect for
        // us in that case.
        history.listen(EventActions.routeDidChange);

        React.render((
            <Router history={history}>
                {redirectRoute}
                {getRoutes(type, subdomain)}
            </Router>
        ), document.getElementById('main'));

        // Send the applicationDidBoot event to the third-party stores
        EventActions.applicationDidBoot(settings);
    }
};

// Initialize pre-start components
initLogging();

requests.defaults({
    urlMap: ApiUrls,
    http: {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }
});

// And bootstrap app
AppGateway.start();
