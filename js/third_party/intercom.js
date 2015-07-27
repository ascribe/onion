'use strict';

import alt from '../alt';
import EventActions from '../actions/event_actions';


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
        window.Intercom('boot', {
            /* eslint-enable */
            app_id: 'oboxh5w1',
            email: profile.email,
            subdomain: window.location.host.split('.')[0],
            widget: {
                activator: '#IntercomDefaultWidget'
            }  
        });
        console.log('Intercom loaded');
        this.loaded = true;
    }

}

export default alt.createStore(IntercomHandler, 'IntercomHandler');
