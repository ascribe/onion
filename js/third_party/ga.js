'use strict';

import alt from '../alt';
import EventActions from '../actions/event_actions';


class GoogleAnalyticsHandler {
    constructor() {
        this.bindActions(EventActions);
    }

    onRouteDidChange() {
        console.log(window.location.href);
        window.ga('send', 'pageview');
    }

    onApplicationWillBoot(settings) {
        if (settings.ga) {
            window.ga('create', settings.ga, 'auto');
            console.log('Google Analytics loaded');
        } else {
            console.log('Cannot load Google Analytics: no tracking code provided');
        }
    }

}

export default alt.createStore(GoogleAnalyticsHandler, 'GoogleAnalyticsHandler');
