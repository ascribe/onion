'use strict';

import { altThirdParty } from '../alt';
import EventActions from '../actions/event_actions';

import Raven from 'raven-js';


class RavenHandler {
    constructor() {
        this.bindActions(EventActions);
        this.loaded = false;
    }

    onProfileDidLoad(profile) {
        if (this.loaded) {
            return;
        }

        Raven.setUserContext({
            email: profile.email
        });
        console.log('Raven loaded');
        this.loaded = true;
    }
}

export default altThirdParty.createStore(RavenHandler, 'RavenHandler');
