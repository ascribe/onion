'use strict';

import { altThirdParty } from '../alt';
import EventActions from '../actions/event_actions';

import { getSubdomain } from '../utils/url_utils';


class IntercomHandler {
    constructor() {
        this.bindActions(EventActions);
        this.loaded = false;
    }

    onUserDidAuthenticate(user) {
        if (this.loaded) {
            return;
        }

        window.Intercom('boot', {
            app_id: 'oboxh5w1',
            email: user.email,
            subdomain: getSubdomain(),
            widget: {
                activator: '#IntercomDefaultWidget'
            }
        });
        console.log('Intercom loaded');
        this.loaded = true;
    }

    onUserDidLogout() {
        // kill intercom (with fire)
        window.Intercom('shutdown');
        this.loaded = false;
    }
}

export default altThirdParty.createStore(IntercomHandler, 'IntercomHandler');
