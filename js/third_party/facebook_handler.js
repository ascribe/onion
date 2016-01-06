'use strict';

import { altThirdParty } from '../alt';

import EventActions from '../actions/event_actions';
import FacebookActions from '../actions/facebook_actions';

import AppConstants from '../constants/application_constants'

class FacebookHandler {
    constructor() {
        this.loaded = false;

        this.bindActions(EventActions);
        this.bindActions(FacebookActions);
    }

    onApplicationWillBoot(settings) {
        // Callback function that FB's sdk will call when it's finished loading
        // See https://developers.facebook.com/docs/javascript/quickstart/v2.5
        window.fbAsyncInit = () => {
            FB.init({
                appId: AppConstants.facebook.appId,
                // Don't parse anything on the first load as we will parse all XFBML components as necessary.
                xfbml: false,
                version: 'v2.5',
                cookie: false
            });

            FacebookActions.sdkReady();
        };
    }

    onSdkReady() {
        this.loaded = true;
    }
}

export default altThirdParty.createStore(FacebookHandler, 'FacebookHandler');
