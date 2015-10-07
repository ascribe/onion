'use strict';

import { altThirdParty } from '../alt';
import EventActions from '../actions/event_actions';

import { getSubdomain } from '../utils/general_utils';


class IntercomHandler {
    constructor() {
        this.bindActions(EventActions);
        this.loaded = false;
    }

    onProfileDidLoad(profile) {
        if (this.loaded) {
            return;
        }

        /* eslint-disable */
        Intercom('boot', {
            /* eslint-enable */
            app_id: 'oboxh5w1',
            email: profile.email,
            subdomain: getSubdomain(),
            widget: {
                activator: '#IntercomDefaultWidget'
            }  
        });
        console.log('Intercom loaded');
        this.loaded = true;
    }

}

export default altThirdParty.createStore(IntercomHandler, 'IntercomHandler');
