import 'core-js/es6';
import 'core-js/stage/4';
import 'classlist-polyfill';
import 'isomorphic-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router/es6/Router';

import AppResolver from './app_resolver';
import history from './history';

import AppConstants from './constants/application_constants';

import { getDefaultSubdomainSettings, getSubdomainSettings } from './utils/constants';
import { initLogging } from './utils/error';
import { getCurrentSubdomain } from './utils/url';
import UrlResolver from './utils/url_resolver';


// FIXME: rename these event actions
import EventActions from './actions/event_actions';

// You can comment out the modules you don't need
// import DebugHandler from './third_party/debug_handler';
import './third_party/facebook_handler';
import './third_party/ga_handler';
import './third_party/intercom_handler';
import './third_party/notifications_handler';
import './third_party/raven_handler';

// Import global stylesheet
import '../sass/main.scss';


const AppGateway = {
    start() {
        let subdomainSettings;

        try {
            subdomainSettings = getSubdomainSettings(getCurrentSubdomain());
        } catch (err) {
            // if there are no matching subdomains, we''ll route to the default frontend
            console.logGlobal(err);
            subdomainSettings = getDefaultSubdomainSettings();
        }

        this.load(subdomainSettings);
    },

    load(settings) {
        // Send the applicationWillBoot event to the third-party stores
        EventActions.applicationWillBoot(settings);

        // `history.listen` is called on every route change, which is perfect for routeDidChange
        // events.
        // For history <= 3.0, history.listen will synchronously invoke the callback once
        // immediately after registration.
        history.listen((location) => {
            const { locationQueue } = history;
            locationQueue.unshift(location);

            // Limit the number of locations to keep in memory to avoid too much memory usage
            if (locationQueue.length > AppConstants.locationThreshold) {
                locationQueue.length = AppConstants.locationThreshold;
            }

            EventActions.routeDidChange(location);
        });

        // Adds a client specific class to the body for whitelabel styling
        window.document.body.classList.add(`client--${settings.subdomain || 'ascribe'}`);

        AppResolver
            .resolve(settings)
            .then(({ apiUrls, redirectRoute, routes }) => {
                // Set url mapping for outgoing api requests
                UrlResolver.setUrlMapping(apiUrls);

                ReactDOM.render((
                    <Router history={history}>
                        {redirectRoute}
                        {routes}
                    </Router>
                ), document.getElementById('main'));

                // Send the applicationDidBoot event to the third-party stores
                EventActions.applicationDidBoot(settings);
            });
    }
};

// Initialize pre-start components
initLogging();

// And bootstrap app
AppGateway.start();
