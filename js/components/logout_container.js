'use strict';

import React from 'react';
import Router from 'react-router';

import UserActions from '../actions/user_actions';
import { alt, altWhitelabel, altUser, altThirdParty } from '../alt';

import AppConstants from '../constants/application_constants';
let baseUrl = AppConstants.baseUrl;

let LogoutContainer = React.createClass({

    mixins: [Router.Navigation, Router.State],

    componentDidMount() {
        UserActions.logoutCurrentUser()
            .then(() => {
                alt.flush();
                altWhitelabel.flush();
                altUser.flush();
                altThirdParty.flush();
                // kill intercom (with fire)
                window.Intercom('shutdown');
                this.replaceWith(baseUrl);
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
