'use strict';

import { altThirdParty } from '../alt';
import EventActions from '../actions/event_actions';

import AppConstants from '../constants/application_constants'

class FacebookHandler {
    constructor() {
        this.bindActions(EventActions);
    }

    onApplicationWillBoot(settings) {
        // Callback function that FB's sdk will call when it's finished loading
        // See https://developers.facebook.com/docs/javascript/quickstart/v2.5
        window.fbAsyncInit = () => {
            FB.init({
                appId: AppConstants.facebook.appId,
                // Force FB to parse everything on first load to make sure all the XFBML components are initialized.
                // If we don't do this, we can run into issues with components on the first load who are not be
                // initialized.
                xfbml: true,
                version: 'v2.5',
                cookie: false
            });
        };
    }
}

export default altThirdParty.createStore(FacebookHandler, 'FacebookHandler');
