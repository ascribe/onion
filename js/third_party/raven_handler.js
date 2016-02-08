'use strict';

import { altThirdParty } from '../alt';
import EventActions from '../actions/event_actions';

import Raven from 'raven-js';


class RavenHandler {
    constructor() {
        this.bindActions(EventActions);
        this.loaded = false;
    }

    onUserDidAuthenticate(user) {
        if (this.loaded) {
            return;
        }

        Raven.setUserContext({
            email: user.email
        });
        console.log('Raven loaded');
        this.loaded = true;
    }

    onUserDidLogout() {
        Raven.setUserContext();
        this.loaded = false;
    }
}

export default altThirdParty.createStore(RavenHandler, 'RavenHandler');
