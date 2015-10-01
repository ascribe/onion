'use strict';

import React from 'react';
import { History } from 'react-router';

import UserActions from '../actions/user_actions';
import Alt from '../alt';

import AppConstants from '../constants/application_constants';
let baseUrl = AppConstants.baseUrl;

let LogoutContainer = React.createClass({

    mixins: [History],

    componentDidMount() {
        UserActions.logoutCurrentUser()
            .then(() => {
                Alt.flush();
                // kill intercom (with fire)
                window.Intercom('shutdown');
                this.history.replaceState(null, baseUrl);
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    },

    render() {
        return null;
    }

});


export default LogoutContainer;
